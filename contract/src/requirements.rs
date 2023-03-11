use crate::{
    errors::{
        ERR_INVALID_PERIOD, ERR_NOT_IN_TIME_PERIOD, ERR_SC_NOT_READY, ERR_SPACE_IS_PAUSED,
        ERR_VALUE_NOT_GREATER_THAN_ZERO,
    },
    storage,
};

multiversx_sc::imports!();
multiversx_sc::derive_imports!();

#[multiversx_sc::module]
pub trait RequirementsModule: storage::StorageModule {
    fn require_is_ready(&self) {
        let mut is_ready = true;

        if self.is_paused().get() {
            is_ready = false;
        }
        require!(is_ready, ERR_SC_NOT_READY);
    }

    fn require_space_not_paused(&self, token_identifier: &TokenIdentifier) {
        require!(
            !self.space_is_paused(token_identifier).get(),
            ERR_SPACE_IS_PAUSED
        );
    }

    fn require_value_is_positive(&self, value: &BigUint) {
        require!(value > &BigUint::zero(), ERR_VALUE_NOT_GREATER_THAN_ZERO);
    }

    fn require_time_period_is_valid(&self, start: u64, end: u64) {
        let current_timestamp = self.blockchain().get_block_timestamp();
        require!(start < end, ERR_INVALID_PERIOD);
        require!(
            start > current_timestamp && end > current_timestamp, // period cannot be in the past
            ERR_INVALID_PERIOD
        );
    }

    fn require_is_in_time_period(&self, start: u64, end: u64) {
        let current_timestamp = self.blockchain().get_block_timestamp();
        require!(
            current_timestamp >= start && current_timestamp <= end,
            ERR_NOT_IN_TIME_PERIOD
        );
    }
}
