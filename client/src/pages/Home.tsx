import { Flex } from "@chakra-ui/react";
import { useGetAccountInfo } from "@multiversx/sdk-dapp/hooks";
import React from "react";
import { NavLink } from "react-router-dom";

export const Home = () => {
  const { address } = useGetAccountInfo();
  const isLoggedIn = Boolean(address);
  return (
    <Flex className="w-full flex-col">
      <h1 className="flex w-full justify-center py-3 text-xl font-semibold">Home</h1>
      <div className="flex w-full justify-center items-center">
        {isLoggedIn && (
          <>
            <NavLink to={"reputation"} className="!bg-teal-300 hover:!bg-teal-400 hover:scale-105 mx-2 px-4 py-2 rounded-lg font-medium">
              REPUTATION GIVER
            </NavLink>
            <NavLink to={"collector"} className="!bg-teal-300 hover:!bg-teal-400 hover:scale-105 mx-2 px-4 py-2 rounded-lg font-medium">
              COLLECTOR
            </NavLink>
          </>
        )}
      </div>
    </Flex>
  );
};

export default Home;
