use crate::{
    errors::{ERR_NO_CAMPAIGN_FOUND, ERR_NO_SPACE_FOUND},
    storage::{self, Campaign, Space},
};

multiversx_sc::imports!();
multiversx_sc::derive_imports!();

#[multiversx_sc::module]
pub trait CommonUtilsModule: storage::StorageModule {
    fn get_space(&self, address: &ManagedAddress) -> Space<Self::Api> {
        let space = self
            .spaces()
            .get(&address)
            .unwrap_or_else(|| sc_panic!(ERR_NO_SPACE_FOUND));

        space
    }

    fn get_campaign(&self, space_id: &TokenIdentifier, nonce: u64) -> Campaign<Self::Api> {
        let campaign = self
            .campaigns(&space_id)
            .get(&nonce)
            .unwrap_or_else(|| sc_panic!(ERR_NO_CAMPAIGN_FOUND));

        campaign
    }

    fn create_uris(
        &self,
        media: ManagedBuffer,
        metadata: ManagedBuffer,
    ) -> ManagedVec<ManagedBuffer> {
        let mut uris = ManagedVec::new();
        let mut media_uri = ManagedBuffer::from("https://ipfs.io/ipfs/");
        media_uri.append(&media);
        uris.push(media_uri);
        let mut metadata_uri = ManagedBuffer::from("https://ipfs.io/ipfs/");
        metadata_uri.append(&metadata);
        uris.push(metadata_uri);
        uris
    }
}
