import React, { useEffect, useState } from "react";
import { Campaign } from "../util/types";
import { Contract } from "../sdk/contract.sdk";
import { useGetAccountInfo } from "@multiversx/sdk-dapp/hooks";
import { buildNftId } from "../util/functions";
import { Box, Image, Text } from "@chakra-ui/react";
import { KycButton } from "../kyc/KycButton";

export const CampaignDetail = () => {
  const { address } = useGetAccountInfo();
  const [campaign, setCampaign] = useState<Campaign>();
  const [nftImage, setNftImage] = useState<string>("");
  // const { hasPendingTransactions } = useGetPendingTransactions();

  useEffect(() => {
    Contract.getSpace(address).then((space: any) => {
      if (space && space.data?.campaigns.length > 0) {
      console.log("Test", space?.data?.campaigns?.[0]);
        setCampaign(space?.data?.campaigns?.[0]);
        const nftId = buildNftId(space.data.campaigns?.[0].spaceId, space.data.campaigns?.[0].nonce);
        setNftImage(nftId);
      }
    });
  }, [address]);

  return (
    <div className="flex flex-col w-full">
      <h1 className="flex w-full justify-center py-3 text-xl font-semibold">Campaign detail</h1>
      <div className="flex flex-col h-[75dvh]">
        <Box className="flex flex-col border-2 border-teal-300 w-fit px-4 mx-auto h-full my-2 rounded-lg">
          <Box boxSize="2xs" className="my-1.5">
            <Image src={`https://devnet-api.multiversx.com/nfts/${nftImage}/thumbnail`} alt="nft" />
          </Box>
          <Text>Name: {campaign?.name}</Text>
          <Text>Amount: {campaign?.claimAmount}</Text>
          {campaign &&
            <div className="flex flex-row w-full h-full my-2 justify-center items-end">
              <KycButton spaceId={campaign?.spaceId} nonce={campaign.nonce} />
            </div>
          }
        </Box>
      </div>
    </div>
  );
};

export default CampaignDetail;