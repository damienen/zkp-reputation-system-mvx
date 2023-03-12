import { Text } from "@chakra-ui/react";
import { useGetAccount, useGetAccountInfo } from "@multiversx/sdk-dapp/hooks";
import { ExtensionLoginButton, LedgerLoginButton, WalletConnectLoginButton, WebWalletLoginButton } from "@multiversx/sdk-dapp/UI";
import { logout } from "@multiversx/sdk-dapp/utils";
import React from "react";

export const Navbar = () => {
  const { address } = useGetAccountInfo();
  const isLoggedIn = Boolean(address);
  const { balance } = useGetAccount();
  const wallet = address?.length;

  return (
    <div className="flex w-full h-14 bg-teal-300 flex-row justify-between shadow-lg">
      <div className="flex flex-col ml-10 text-center justify-center">
        <Text className="text-sm font-bold">Durin</Text>
        <Text className="text-sm font-bold">Your First MultiversX NFT Reputation System</Text>
      </div>
      <div className="flex flex-row items-center justify-center">
        {!isLoggedIn ? (
          <>
            <ExtensionLoginButton callbackRoute={"/"} loginButtonText={"Extension"} />
            <WebWalletLoginButton callbackRoute={"/"} loginButtonText={"Web wallet"} />
            <LedgerLoginButton callbackRoute={"/"} loginButtonText={"Ledger"} />
            <WalletConnectLoginButton callbackRoute={"/"} loginButtonText={"xPortal"} isWalletConnectV2={true} />
          </>
        ) : (
          <div className="flex flex-row">
            <div className="flex relative bg-blueb/90 md:px-5 px-3 rounded">
              <p className="md:text-base text-xs md:my-0 my-1">
                {address.substring(0, 5)}...{address.substring(wallet - 5)} : &nbsp;
                {(Number(balance) / Math.pow(10, 18)).toFixed(3)}
              </p>
            </div>
            <button className="md:ml-8 sm:ml-3 ml-1 bg-blueb/90 md:px-5 px-1 rounded md:text-base text-xs" onClick={() => logout("/")}>
              Log out
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Navbar;
