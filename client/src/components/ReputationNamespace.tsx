import { Flex, Input, Link, Stack, Text, Button } from "@chakra-ui/react";
import React, { useEffect, useState } from "react";
import { NavLink as RouterLink } from "react-router-dom";
import { createSpaceTransaction } from "../mx/collectionTxs";
import { useGetAccountInfo, useGetPendingTransactions } from "@multiversx/sdk-dapp/hooks";
import { MultiversXApi } from "../sdk/multiversXApi.sdk";

export const ReputationNamespace = () => {
  const { address } = useGetAccountInfo();
  const [tick, setTick] = useState("");
  const [name, setName] = useState("");
  const { hasPendingTransactions } = useGetPendingTransactions();

  useEffect(() => {
    MultiversXApi.getLastCollectionCreated(address)
      .then(data => setTick(data.data.ticker));
  }, [hasPendingTransactions]);

  return (
    <div className="flex flex-col w-full">
      <h1 className="flex w-full justify-center py-3 text-xl font-semibold">Reputation namespace</h1>
      <Flex className="flex flex-col w-full h-[75dvh] justify-center items-center">
        <Text className="font-medium">Time to transform your collection into a space</Text>

        <Stack className="gap-3 mt-2">
          <Input className="" placeholder="Name" onBlur={(e) => {setName(e.target.value);}}/>
          <Text className="text-red-400 !-mt-2 !ml-1.5">This field is required!</Text>
        </Stack>
        <Link
          as={RouterLink}
          to="/space">
          <Button
            className="mt-4 !w-full !bg-teal-300 hover:!bg-teal-400 hover:scale-105 mx-2 px-4 py-2 rounded-lg font-medium text-center"
            onClick={() => createSpaceTransaction(address, tick, name)}>Designate space</Button>
        </Link>
      </Flex>
    </div>
  );
};

export default ReputationNamespace;
