import { PlusSquareIcon, StarIcon } from "@chakra-ui/icons";
import { HStack, Link, VStack } from "@chakra-ui/react";
import React from "react";
import { NavLink } from "react-router-dom";

export const Home = () => {
  // const { address } = useGetAccountInfo();
  // const isLoggedIn = Boolean(address);
  return (
    <VStack justifyContent={"center"} alignItems={"center"} h={"100%"}>
      <HStack>
        <Link as={NavLink} to={"reputation"} className="!bg-teal-300 hover:!bg-teal-400 hover:scale-105 mx-5 px-2 py-2 rounded-lg font-medium border-2">
          <VStack minW={180}>
            {" "}
            <div>REPUTATION GIVER</div>
            <PlusSquareIcon boxSize={100}></PlusSquareIcon>
          </VStack>
        </Link>
        <Link as={NavLink} to={"collector"} className="!bg-teal-300 hover:!bg-teal-400 hover:scale-105 mx-5 px-2 py-2 rounded-lg font-medium border-2">
          <VStack minW={180}>
            <div>COLLECTOR</div>
            <StarIcon boxSize={100}></StarIcon>
          </VStack>
        </Link>
      </HStack>
    </VStack>
  );
};

export default Home;
