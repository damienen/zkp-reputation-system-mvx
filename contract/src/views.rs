use crate::{
    common_utils,
    storage::{self, Campaign, Space},
};

multiversx_sc::imports!();
multiversx_sc::derive_imports!();

#[derive(TopEncode, TopDecode, NestedEncode, NestedDecode, PartialEq, Clone, Debug, TypeAbi)]
pub struct SpaceView<M: ManagedTypeApi> {
    pub space: Space<M>,
    pub campaigns: ManagedVec<M, Campaign<M>>,
}

#[derive(
    ManagedVecItem,
    TopEncode,
    TopDecode,
    NestedEncode,
    NestedDecode,
    PartialEq,
    Clone,
    Debug,
    TypeAbi,
)]
pub struct ClaimsView<M: ManagedTypeApi> {
    pub campaign: Campaign<M>,
    pub amount: BigUint<M>,
}

#[derive(
    ManagedVecItem,
    TopEncode,
    TopDecode,
    NestedEncode,
    NestedDecode,
    PartialEq,
    Clone,
    Debug,
    TypeAbi,
)]
pub struct UserView<M: ManagedTypeApi> {
    pub campaign: Campaign<M>,
    pub amount: BigUint<M>,
    pub whitelisted: bool,
    pub claimed: bool,
}

#[multiversx_sc::module]
pub trait ViewsModule: storage::StorageModule + common_utils::CommonUtilsModule {
    #[view(getSpaces)]
    fn get_spaces(&self) -> ManagedVec<Space<Self::Api>> {
        let spaces = self
            .spaces()
            .values()
            .collect::<ManagedVec<Space<Self::Api>>>();

        spaces
    }

    #[view(getSpaceCampaigns)]
    fn get_space_campaigns(&self, space_id: &TokenIdentifier) -> ManagedVec<Campaign<Self::Api>> {
        let campaigns = self
            .campaigns(space_id)
            .values()
            .collect::<ManagedVec<Campaign<Self::Api>>>();

        campaigns
    }

    #[view(viewSpace)]
    fn view_space(&self, address: &ManagedAddress) -> SpaceView<Self::Api> {
        let space = self.get_space(address);
        let campaigns = self.get_space_campaigns(&space.space_id);

        SpaceView { space, campaigns }
    }

    #[view(viewClaims)]
    fn view_claims(&self, address: &ManagedAddress) -> ManagedVec<ClaimsView<Self::Api>> {
        let mut claims: ManagedVec<ClaimsView<Self::Api>> = ManagedVec::new();

        let claimable_spaces = self.claimable_address_amount(&address);

        for (space_id, campaigns) in claimable_spaces.iter() {
            for (nonce, eligible_amount) in campaigns.iter() {
                let campaign = self.get_campaign(&space_id, nonce);
                if eligible_amount > 0u64
                    && self.campaign_whitelist(&space_id, nonce).contains(&address)
                {
                    let claim = ClaimsView {
                        campaign,
                        amount: eligible_amount.clone(),
                    };
                    claims.push(claim);
                }
            }
        }

        claims
    }

    #[view(getIndividualCampaign)]
    fn get_individual_campaign(
        &self,
        token_identifier: &TokenIdentifier,
        nonce: u64,
        address: &ManagedAddress,
    ) -> UserView<Self::Api> {
        let whitelisted = self
            .campaign_whitelist(&token_identifier, nonce)
            .contains(address);
        let claimed = self
            .already_claimed(&token_identifier, nonce)
            .contains(&address);

        let campaign = self.get_campaign(token_identifier, nonce);

        let eligble_amount = campaign.claim_amount.clone();

        let kyc = UserView {
            campaign,
            amount: eligble_amount,
            whitelisted,
            claimed,
        };
        kyc
    }
}
