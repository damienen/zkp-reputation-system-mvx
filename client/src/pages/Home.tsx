import { Button, Flex } from "@chakra-ui/react";
import React from "react";

// const spaces = [
//   {
//     space_id: "QRDS23",
//     name: "Ceva",
//   },
//   {
//     space_id: "ASDW231",
//     name: "Altceva",
//   },
//   {
//     space_id: "DAWD8231",
//     name: "Test",
//   },
// ];

export const Home = () => {
  return (
    <Flex className="w-full flex-col">
      <h1 className="flex w-full justify-center py-3 text-xl font-semibold">Home</h1>
      {/*<Box className="mt-3">*/}
      {/*  {spaces.map((space, index) => (*/}
      {/*    <Card key={index} className={"grid grid-cols-2 w-full py-1 "}>*/}
      {/*      <span className="font-bold px-2">{space.space_id}</span>*/}
      {/*      <span>{space.name}</span>*/}
      {/*    </Card>*/}
      {/*  ))}*/}
      {/*</Box>*/}
      <div className="flex w-full h-[75dvh] justify-center items-center">
        <Button className="!bg-teal-300 hover:!bg-teal-400 hover:scale-105 mx-2">REPUTATION GIVER</Button>
        <Button className="!bg-teal-300 hover:!bg-teal-400 hover:scale-105 mx-2">COLLECTOR</Button>
      </div>
    </Flex>
  );
};

export default Home;
