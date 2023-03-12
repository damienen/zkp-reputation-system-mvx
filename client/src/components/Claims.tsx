import { useGetAccountInfo } from "@multiversx/sdk-dapp/hooks";
import React, { useEffect, useState } from "react";
import { Contract } from "sdk/contract.sdk";
import { Campaign } from "../util/types";

export const Claims = () => {
  const { address } = useGetAccountInfo();
  const [campaign, setCampaign] = useState<Campaign[]>([]);
  const [amount, setAmount] = useState(0);

  useEffect(() => {
    Contract.getClaims(address).then((space: any) => {
      if (space) {
        console.log(space);
        setCampaign(space.data.campaign);
        setAmount(space.data.amount);
        // setNftImage(buildNftId(space.data.spaceId, space.data.campaigns.nonce));
      }
    });
  }, [address]);

  return (
    <div className="flex flex-col w-full">
      <h1 className="flex w-full justify-center py-3 text-xl font-semibold">Claims</h1>
    </div>
  );
};

export default Claims;
