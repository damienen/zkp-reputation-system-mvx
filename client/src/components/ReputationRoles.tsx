import { Flex, Text } from "@chakra-ui/react";
import React from "react";
import { NavLink } from "react-router-dom";

export const ReputationRoles = () => {
  return (
    <div className="flex flex-col w-full">
      <h1 className="flex w-full justify-center py-3 text-xl font-semibold">Reputation Roles</h1>
      <Flex className="flex flex-col w-full h-[75dvh] justify-center items-center">
        <Text className="font-medium">You have to set your collection roles</Text>
        <NavLink to="namespace" className="mt-4 !w-1/4 !bg-teal-300 hover:!bg-teal-400 hover:scale-105 mx-2 px-4 py-2 rounded-lg font-medium text-center">
          Set roles
        </NavLink>
      </Flex>
    </div>
  );
};

export default ReputationRoles;
