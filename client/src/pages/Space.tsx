import { AddIcon } from "@chakra-ui/icons";
import { Box, Image, Text } from "@chakra-ui/react";
import { useGetAccountInfo } from "@multiversx/sdk-dapp/hooks";
import React, { useEffect, useState } from "react";
import { Contract } from "sdk/contract.sdk";
import { Campaign } from "../util/types";

export const Space = () => {
  const { address } = useGetAccountInfo();
  const [ceva, setCeva] = useState<Campaign[]>([]);
  const [spaceId, setSpaceId] = useState("");
  const [nftImage, setNftImage] = useState("");

  const buildNftId = (collectionId: string, nonce: number) => {
    let hexnonce = nonce?.toString(16);
    if (hexnonce?.length % 2 !== 0) {
      hexnonce = "0" + hexnonce;
    }
    return collectionId + "-" + hexnonce;
  };

  useEffect(() => {
    Contract.getSpace(address).then((space: any) => {
      console.log("Test", space);
      if (space) {
        setCeva(space.data.campaigns);
        setSpaceId(space.data.spaceId);
        setNftImage(buildNftId(space.data.spaceId, space.data.campaigns.nonce));
      }
    });
  }, [address]);

  return (
    <div className="flex flex-col w-full">
      <h1 className="flex w-full justify-center py-3 text-xl font-semibold">Space</h1>

      <span className="font-medium pl-10 text-black/60 text-sm">Space: {spaceId}</span>

      <div className="flex flex-row justify-between">
        <span className="font-medium pl-10 text-black/80 mt-2">Your active campains</span>
        <div>
          <AddIcon className="mr-10">ceva</AddIcon>
        </div>
      </div>
      {ceva.map((campaigns, index) => {
        return (
          <div className="grid lg:grid-cols-2 xl:grid-cols-3" key={index}>
            <Box className="flex flex-col border-2 border-teal-300 w-fit px-4 ml-10 mt-2 rounded-lg">
              <Box boxSize="2xs">
                <Image src={`https://api.multiversx.com/nfts/${nftImage}/thumbnail`} alt="nft" />
              </Box>
              <Text>Campaign name: {campaigns.name}</Text>
              <Text>Space ID: {campaigns.spaceId}</Text>
              <Text>Max supply: {campaigns.maxSupply}</Text>
              <Text>
                Minted supply: {campaigns.mintedSupply} / {campaigns.maxSupply}
              </Text>
              <Text className="mb-2">Has whitelist enabled: {campaigns.requireWhitelist ? "true" : ""}</Text>
            </Box>
          </div>
        );
      })}
      {/*{ceva.spaceId}*/}
    </div>
  );
};

export default Space;
