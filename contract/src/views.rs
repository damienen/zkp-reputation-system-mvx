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

#[multiversx_sc::module]
pub trait ViewsModule: storage::StorageModule + common_utils::CommonUtils {
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
}
