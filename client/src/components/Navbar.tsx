import { Text } from "@chakra-ui/react";
import { useGetAccount, useGetAccountInfo } from "@multiversx/sdk-dapp/hooks";
import { ExtensionLoginButton, LedgerLoginButton, WalletConnectLoginButton, WebWalletLoginButton } from "@multiversx/sdk-dapp/UI";
import { logout } from "@multiversx/sdk-dapp/utils";
import React from "react";
import { NavLink } from "react-router-dom";

const navigationItems = [
  {
    title: "Home",
    icon: "home",
    path: "/",
  },
  {
    title: "About",
    icon: "info",
    path: "/about",
  },
  {
    title: "Space",
    icon: "info",
    path: "/space",
  },
];

export const Navbar = () => {
  const { address } = useGetAccountInfo();
  const isLoggedIn = Boolean(address);
  const { balance } = useGetAccount();
  const wallet = address?.length;

  return (
    <div className="flex-none w-full h-14 grid grid-cols-3 py-1.5 bg-teal-300">
      <div className="flex flex-col ml-20">
        <Text className="text-sm">Reputation</Text>
        <Text className="text-base">Client</Text>
      </div>
      <div className="flex flex-row items-center justify-center">
        {navigationItems.map((items, index) => {
          return (
            <div key={index} className="px-2">
              <NavLink to={items.path} className={({ isActive }) => (isActive ? "font-bold border-b-2 border-zinc-800" : "font-bold")}>
                {items.title}
              </NavLink>
            </div>
          );
        })}
      </div>
      <div className="flex flex-row items-center justify-center">
        {!isLoggedIn ? (
          <>
            <ExtensionLoginButton callbackRoute={"/"} loginButtonText={"Extension"} className={"my-4 py-2 unlockButton"} />
            <WebWalletLoginButton callbackRoute={"/"} loginButtonText={"Web wallet"} className={"my-4 py-2 unlockButton"} />
            <LedgerLoginButton callbackRoute={"/"} loginButtonText={"Ledger"} className={"my-4 py-2 unlockButton"} />
            <WalletConnectLoginButton callbackRoute={"/"} loginButtonText={"xPortal"} className={"my-4 py-2 unlockButton"} isWalletConnectV2={true} />
          </>
        ) : (
          <div className="flex flex-row">
            <div className="flex relative bg-blueb/90 md:px-5 px-3 rounded">
              <p className="md:text-base text-xs md:my-0 my-1">
                {address.substring(0, 5)}...{address.substring(wallet - 5)} : &nbsp;
                {(Number(balance) / Math.pow(10, 18)).toFixed(3)}
              </p>
              {/*<img*/}
              {/*  src="../img/multiversX.png"*/}
              {/*  alt="EGLD"*/}
              {/*  className="pl-1 w-6 h-6 my-auto"*/}
              {/*/>*/}
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
