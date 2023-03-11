import { Flex, Input, Stack, Text } from "@chakra-ui/react";
import React from "react";
import { NavLink } from "react-router-dom";

export const ReputationNamespace = () => {
  return (
    <div className="flex flex-col w-full">
      <h1 className="flex w-full justify-center py-3 text-xl font-semibold">Reputation namespace</h1>
      <Flex className="flex flex-col w-full h-[75dvh] justify-center items-center">
        <Text className="font-medium">Time to transform your collection into a space</Text>

        <Stack className="gap-3 mt-2">
          <Input className="" placeholder="Name" />
          <Text className="text-red-400 !-mt-2 !ml-1.5">This field is required!</Text>
        </Stack>
        <NavLink to="" className="mt-4 !w-1/4 !bg-teal-300 hover:!bg-teal-400 hover:scale-105 mx-2 px-4 py-2 rounded-lg font-medium text-center">
          Designate space
        </NavLink>
      </Flex>
    </div>
  );
};

export default ReputationNamespace;
