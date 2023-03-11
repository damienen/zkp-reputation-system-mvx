#![no_std]

multiversx_sc::imports!();

#[multiversx_sc::contract]
pub trait Reputation {
    #[init]
    fn init(&self) {}
}
