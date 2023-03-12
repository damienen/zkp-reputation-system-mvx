#![no_std]

use storage::{Campaign, Space};

use crate::errors::{
    ERR_CAMPAIGN_DOES_NOT_REQUIRE_WHITELIST, ERR_NOTHING_TO_CLAIM, ERR_NOT_WHITELISTED,
};

multiversx_sc::imports!();

pub mod common_utils;
pub mod constants;
pub mod errors;
pub mod requirements;
pub mod storage;
pub mod views;

#[multiversx_sc::contract]
pub trait Reputation:
    storage::StorageModule
    + requirements::RequirementsModule
    + common_utils::CommonUtilsModule
    + views::ViewsModule
{
    #[init]
    fn init(&self) {}

    #[endpoint(createSpace)]
    fn create_space(&self, token_identifier: TokenIdentifier, name: ManagedBuffer) {
        let caller = self.blockchain().get_caller();

        let space: Space<Self::Api> = Space {
            space_id: token_identifier,
            name,
        };

        self.spaces().insert(caller, space);
    }

    #[payable("*")]
    #[endpoint(createCampaign)]
    fn create_campaign(
        &self,
        name: ManagedBuffer,
        media: ManagedBuffer,
        metadata: ManagedBuffer,
        claim_amount: BigUint,
        automated: bool, // for front end
        require_whitelist: bool,
        opt_supply: OptionalValue<BigUint>, // Some or None
        opt_period: OptionalValue<MultiValue2<u64, u64>>,
    ) {
        self.require_is_ready();
        let caller = self.blockchain().get_caller();
        let space = self.get_space(&caller); // will panic if use doesn't have a space

        self.require_space_not_paused(&space.space_id); // requires space to be unpaused

        self.require_value_is_positive(&claim_amount);

        let (start, end) = opt_period
            .into_option()
            .unwrap_or_else(|| MultiValue2((0u64, 0u64)))
            .into_tuple();

        let max_supply = opt_supply.into_option().unwrap_or_default();

        if !require_whitelist {
            self.require_value_is_positive(&max_supply);
        }

        if start > 0u64 && end > 0u64 {
            self.require_time_period_is_valid(start, end);
        }

        let token_identifier = space.space_id.clone();

        if !require_whitelist {
            self.require_value_is_positive(&max_supply);
        }

        let mut attributes = ManagedBuffer::from("metadata:");
        attributes.append(&metadata);
        let nonce = self.send().esdt_nft_create(
            &space.space_id,
            &BigUint::from(1u64),
            &name,
            &BigUint::zero(),
            &ManagedBuffer::new(),
            &attributes, // ened att
            &self.create_uris(media, metadata),
        );

        let created_date = self.blockchain().get_block_timestamp();

        let campaign: Campaign<Self::Api> = Campaign {
            space_id: space.space_id,
            nonce,
            name,
            claim_amount,
            automated,
            max_supply,
            minted_supply: BigUint::zero(),
            start,
            end,
            created_date,
            require_whitelist,
        };

        self.campaigns(&token_identifier).insert(nonce, campaign);
    }

    #[endpoint(claim)]
    fn claim(&self, token_identifier: TokenIdentifier, nonce: u64) {
        self.require_is_ready();
        let caller = self.blockchain().get_caller();

        self.require_space_not_paused(&token_identifier);

        let mut campaign = self.get_campaign(&token_identifier, nonce);

        if campaign.start > 0u64 && campaign.end > 0u64 {
            self.require_is_in_time_period(campaign.start, campaign.end);
        }

        match campaign.require_whitelist {
            false => {
                let already_claimed = self
                    .already_claimed(&token_identifier, nonce)
                    .contains(&caller);

                require!(
                    !already_claimed && campaign.minted_supply < campaign.max_supply,
                    ERR_NOTHING_TO_CLAIM
                );

                self.send()
                    .esdt_local_mint(&token_identifier, nonce, &campaign.claim_amount);
                self.send()
                    .direct_esdt(&caller, &token_identifier, nonce, &campaign.claim_amount);

                campaign.minted_supply += &campaign.claim_amount;

                self.already_claimed(&token_identifier, nonce)
                    .insert(caller);
            }
            true => {
                require!(
                    self.campaign_whitelist(&token_identifier, nonce)
                        .contains(&caller),
                    ERR_NOT_WHITELISTED
                );

                let eligible_amount = self
                    .claimable_address_amount(&caller)
                    .get(&token_identifier)
                    .and_then(|f| f.get(&nonce)) // this can return None
                    .unwrap_or_default();

                require!(eligible_amount > 0, ERR_NOTHING_TO_CLAIM);

                self.send()
                    .esdt_local_mint(&token_identifier, nonce, &eligible_amount);

                self.send()
                    .direct_esdt(&caller, &token_identifier, nonce, &eligible_amount);

                campaign.minted_supply += &eligible_amount;

                self.claimable_address_amount(&caller)
                    .get(&token_identifier)
                    .unwrap() // will never have None
                    .remove(&nonce);

                self.already_claimed(&token_identifier, nonce)
                    .insert(caller);
            }
        }
        self.campaigns(&token_identifier).insert(nonce, campaign);
    }

    #[endpoint(addKycKey)]
    fn add_kyc_key(&self, token_identifier: TokenIdentifier, nonce: u64, key: ManagedBuffer) {
        let caller = self.blockchain().get_caller();
        let mut addresses = MultiValueEncoded::new();
        addresses.push(caller.clone());
        if self.kyc_backend_keys().contains(&key) {
            self.whitelist_participants(token_identifier, nonce, addresses);
            self.kyc_backend_keys().swap_remove(&key);
        } else {
            self.kyc_address_keys().insert(key.clone(), caller);
            self.kyc_token_keys().insert(key.clone(), token_identifier);
            self.kyc_nonce_keys().insert(key, nonce);
        }
    }

    #[endpoint(checkKycKey)]
    fn check_kyc_key(&self, key: ManagedBuffer) {
        let user = self.kyc_address_keys().get(&key);

        match user {
            Option::None => {
                self.kyc_backend_keys().insert(key);
            }
            Option::Some(user) => {
                let mut addresses = MultiValueEncoded::new();
                addresses.push(user.clone());
                let token_identifier = self.kyc_token_keys().get(&key).unwrap();
                let nonce = self.kyc_nonce_keys().get(&key).unwrap();
                self.whitelist_participants(token_identifier, nonce, addresses);
                self.kyc_address_keys().remove(&key);
                self.kyc_token_keys().remove(&key);
                self.kyc_nonce_keys().remove(&key);
                self.kyc_backend_keys().swap_remove(&key);
            }
        }
    }

    #[endpoint(whitelistParticipants)]
    fn whitelist_participants(
        &self,
        token_identifier: TokenIdentifier,
        nonce: u64,
        addresses: MultiValueEncoded<ManagedAddress>,
    ) {
        self.require_is_ready();

        self.require_space_not_paused(&token_identifier); // checks if space is paused

        let mut campaign = self.get_campaign(&token_identifier, nonce); // will panic if the campaign doesn't exist

        require!(
            campaign.require_whitelist,
            ERR_CAMPAIGN_DOES_NOT_REQUIRE_WHITELIST
        );

        let current_timestamp = self.blockchain().get_block_timestamp();

        self.require_number_of_addresses_in_bulk_is_valid(&addresses.len());

        campaign.created_date = current_timestamp;
        campaign.max_supply += BigUint::from(addresses.len());

        for address in addresses.into_iter() {
            self.claimable_address_amount(&address)
                .insert_default(token_identifier.clone());

            self.claimable_address_amount(&address)
                .get(&token_identifier)
                .unwrap() // will never have None
                .insert(campaign.nonce, campaign.claim_amount.clone());

            self.campaign_whitelist(&campaign.space_id, nonce)
                .insert(address);
        }

        self.campaigns(&token_identifier).insert(nonce, campaign);
    }

    #[endpoint(delistParticipants)]
    fn delist_participants(&self, nonce: u64, addresses: MultiValueEncoded<ManagedAddress>) {
        self.require_is_ready();
        let caller = self.blockchain().get_caller();
        let space = self.get_space(&caller);

        self.require_space_not_paused(&space.space_id); // checks if space is paused

        let mut campaign = self.get_campaign(&space.space_id, nonce);
        require!(
            campaign.require_whitelist,
            ERR_CAMPAIGN_DOES_NOT_REQUIRE_WHITELIST
        );
        let current_timestamp = self.blockchain().get_block_timestamp();

        self.require_number_of_addresses_in_bulk_is_valid(&addresses.len());

        campaign.created_date = current_timestamp;
        campaign.max_supply -= BigUint::from(addresses.len());

        for address in addresses.into_iter() {
            self.claimable_address_amount(&address)
                .get(&campaign.space_id)
                .unwrap() // will never have None
                .remove(&campaign.nonce);

            self.campaign_whitelist(&campaign.space_id, nonce)
                .swap_remove(&address);
        }
        self.campaigns(&space.space_id).insert(nonce, campaign);
    }

    #[only_owner]
    #[endpoint(pauseSpace)]
    fn pause_space(&self, space_id: TokenIdentifier) {
        self.space_is_paused(&space_id).set(true);
    }

    #[only_owner]
    #[endpoint(unpauseSpace)]
    fn unpause_space(&self, space_id: TokenIdentifier) {
        self.space_is_paused(&space_id).set(false);
    }

    #[only_owner]
    #[endpoint(pause)]
    fn pause(&self) {
        self.is_paused().set(true);
    }

    #[only_owner]
    #[endpoint(unpause)]
    fn unpause(&self) {
        self.is_paused().set(false);
    }

    #[only_owner]
    #[endpoint(setAdministrator)]
    fn set_administrator(&self, administrator: ManagedAddress) {
        self.administrator().set(&administrator);
    }
}
