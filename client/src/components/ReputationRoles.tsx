import { Button, Flex, Text } from "@chakra-ui/react";
import React, { useEffect, useState } from "react";
import { NavLink } from "react-router-dom";
import { sendSetSpecialRoleTransaction } from "../mx/collectionTxs";
import { useGetAccountInfo, useGetPendingTransactions } from "@multiversx/sdk-dapp/hooks";
import { MultiversXApi } from "../sdk/multiversXApi.sdk";

export const ReputationRoles = () => {
  const { address } = useGetAccountInfo();
  const [tick, setTick] = useState("");
  const { hasPendingTransactions } = useGetPendingTransactions();

  useEffect(() => {
      MultiversXApi.getLastCollectionCreated(address)
        .then(data => setTick(data.data.ticker));
  }, [hasPendingTransactions]);

  return (
    <div className="flex flex-col w-full">
      <h1 className="flex w-full justify-center py-3 text-xl font-semibold">Reputation Roles</h1>
      <Flex className="flex flex-col w-full h-[75dvh] justify-center items-center">
        <Text className="font-medium">You have to set your collection roles</Text>
        <NavLink to="namespace">
          <Button
            className="mt-4 !w-full !bg-teal-300 hover:!bg-teal-400 hover:scale-105 px-4 py-2 rounded-lg font-medium text-center"
            onClick={() => sendSetSpecialRoleTransaction(address, tick)}>Set roles</Button>
        </NavLink>
      </Flex>
    </div>
  );
};

export default ReputationRoles;
