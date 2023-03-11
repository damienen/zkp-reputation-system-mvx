import { Button, Input, Stack, Text } from "@chakra-ui/react";
import React, { useEffect, useState } from "react";

const errorMessageContain = {
  nameCharactersError: "Name must be between 3 and 20 characters",
  nameAlphanumericError: "Name must contain only letters and numbers",
  tickerCharactersError: "Ticker must be between 3 and 20 characters",
  tickerAlphanumericError: "Ticker must contain only upper letters and numbers",
};

export const ReputationGiver = () => {
  const [nameValue, setNameValue] = useState<string>("");
  const [tickerValue, setTickerValue] = useState<string>("");
  const [isError, setError] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string>("");

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

  const handleTickerError = (e: any) => {
    if (e.target.value.match("^[A-Z0-9_]*$") !== null) {
      setTickerValue(e.target.value);
      setError(false);
      // console.log("Test", e.target.value.match("^[A-Z0-9_]*$") !== null);
      return;
    } else {
      setError(true);
      setErrorMessage(errorMessageContain.tickerAlphanumericError);
    }

    if (e.target.value >= 3 && e.target.value <= 10) {
      setTickerValue(e.target.value);
      setError(false);
      console.log("Test", e.target.value >= 3 && e.target.value <= 10);
      return;
    } else {
      setError(true);
      setErrorMessage(errorMessageContain.tickerCharactersError);
    }
  };

  return (
    <div className="flex flex-col w-full">
      <div className="flex w-full justify-center py-3 text-xl font-semibold">Reputation Giver</div>
      <div className="flex flex-col w-full h-[75dvh] justify-center items-center">
        <Text className="font-medium">You did not created a space yet!</Text>
        <Stack className="gap-3 mt-2">
          {!isError && <Input placeholder="Name" size="md" onChange={(e) => setNameValue(e.target.value)} />}
          {isError && <Input isInvalid placeholder="Name" errorBorderColor="crimson" size="md" onChange={(e) => setNameValue(e.target.value)} />}
          <Input placeholder="Ticker" size="md" onBlur={(e) => handleTickerError(e)} />
        </Stack>
        <Button className="mt-4 !w-1/4 !bg-teal-300" onClick={() => alert("ceva")}>
          Create
        </Button>
      </div>
    </div>
  );
};

export default ReputationGiver;
