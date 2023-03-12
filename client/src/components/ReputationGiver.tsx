import { Button, Input, Stack, Text } from "@chakra-ui/react";
import React, { useEffect, useState } from "react";
import { NavLink } from "react-router-dom";
import { sendIssueCollectionTransaction } from "../mx/collectionTxs";
import { useGetAccountInfo, useGetPendingTransactions } from "@multiversx/sdk-dapp/hooks";
import { Contract } from "../sdk/contract.sdk";

// const errorMessageContain = {
//   nameCharactersError: "Name must be between 3 and 20 characters",
//   nameAlphanumericError: "Name must contain only letters and numbers",
//   tickerCharactersError: "Ticker must be between 3 and 20 characters",
//   tickerAlphanumericError: "Ticker must contain only upper letters and numbers",
// };

export const ReputationGiver = () => {
  const { address } = useGetAccountInfo();
  const [nameValue, setNameValue] = useState<string>("");
  const [tickerValue, setTickerValue] = useState<string>("");
  const [spaceId, setSpaceId] = useState<string>("");
  const { hasPendingTransactions } = useGetPendingTransactions();

  // const [isError, setError] = useState<boolean>(false);
  // const [errorMessage, setErrorMessage] = useState<string>("");
  console.log(nameValue, tickerValue);

  useEffect(() => {
    Contract.getSpace(address).then((space: any) => {
      // console.log("Test", space);
      if (space) {
        setSpaceId(space?.data?.spaceId);
      }
    });
    console.log(hasPendingTransactions);
  }, [address, hasPendingTransactions]);


  // useEffect(() => {
  //   if (nameValue.length >= 3 && nameValue.length <= 20 && nameValue.match("^[a-zA-Z0-9_]*$") !== null) {
  //     setError(false);
  //     return;
  //   } else {
  //     setError(true);
  //     setErrorMessage(errorMessageContain.nameCharactersError);
  //   }
  //   console.log("Test", nameValue.match("^[a-zA-Z0-9_]*$") !== null);
  // }, [nameValue]);

  // const handleTickerError = (e: any) => {
  //   if (e.target.value.match("^[A-Z0-9_]*$") !== null) {
  //     setTickerValue(e.target.value);
  //     setError(false);
  //     // console.log("Test", e.target.value.match("^[A-Z0-9_]*$") !== null);
  //     return;
  //   } else {
  //     setError(true);
  //     setErrorMessage(errorMessageContain.tickerAlphanumericError);
  //   }
  //
  //   if (e.target.value >= 3 && e.target.value <= 10) {
  //     setTickerValue(e.target.value);
  //     setError(false);
  //     console.log("Test", e.target.value >= 3 && e.target.value <= 10);
  //     return;
  //   } else {
  //     setError(true);
  //     setErrorMessage(errorMessageContain.tickerCharactersError);
  //   }
  // };

  return (
    <div className="flex flex-col w-full">
      <div className="flex w-full justify-center py-3 text-xl font-semibold">Reputation Giver</div>
      <div className="flex flex-col w-full h-[75dvh] justify-center items-center">
        {!spaceId ?
          <>
            <Text className="font-medium">You did not created a space yet!</Text>
            <Stack className="gap-3 mt-2">
              <Input placeholder="Name" size="md" onBlur={(e) => setNameValue(e.target.value)} />
              <Input placeholder="Ticker" size="md" onBlur={(e) => setTickerValue(e.target.value)} />
            </Stack>
          </>
          :
          <Text className="font-medium">You already have a space created!</Text>
        }
        {!spaceId &&
        <NavLink to={"roles"}>
          <Button
            className="mt-4 !w-full !bg-teal-300 hover:!bg-teal-400 hover:scale-105 px-4 py-2 rounded-lg font-medium text-center"
            onClick={() => sendIssueCollectionTransaction(address, nameValue, tickerValue)}>Create</Button>
        </NavLink>
        }
      </div>
    </div>
  );
};

export default ReputationGiver;
