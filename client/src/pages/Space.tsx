import { AddIcon } from "@chakra-ui/icons";
import {
  Box,
  Button,
  Checkbox,
  Image,
  Input,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Text,
  useDisclosure,
} from "@chakra-ui/react";
import { Address, BigUIntValue, BooleanValue, ContractFunction, StringValue, Transaction, TransactionPayload } from "@multiversx/sdk-core/out";
import { useGetAccountInfo, useGetPendingTransactions } from "@multiversx/sdk-dapp/hooks";
import { sendTransactions } from "@multiversx/sdk-dapp/services";
import { refreshAccount } from "@multiversx/sdk-dapp/utils";
import React, { useEffect, useState } from "react";
import { Contract } from "sdk/contract.sdk";
import { Campaign } from "../util/types";
import { buildNftId } from "../util/functions";

export const Space = () => {
  const { address } = useGetAccountInfo();
  const [campaign, setCampaign] = useState<Campaign[]>([]);
  const [spaceId, setSpaceId] = useState("");
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [checkedItems, setCheckedItems] = useState(true);
  const { hasPendingTransactions } = useGetPendingTransactions();

  // FORM

  const [name, setName] = React.useState("");
  const handleNameChange = (event: any) => setName(event.target.value);
  const [media, setMedia] = React.useState("");
  const handleMediaChange = (event: any) => setMedia(event.target.value);
  const [attributes, setAttributes] = React.useState("");
  const handleAttributesChange = (event: any) => setAttributes(event.target.value);
  const [claimAmount, setClaimAmount] = React.useState(0);
  const handleClaimAmount = (event: any) => setClaimAmount(event.target.value);
  const [automated, setAutomated] = React.useState(1);
  const handleAutomated = (event: any) => setAutomated(event.target.value);
  const [requireWhitelist, setRequireWhitelist] = React.useState(1);
  const handleRequireWhitelist = (event: any) => setRequireWhitelist(event.target.value);


  const addCampaign = async (name: string, media: string, metadata: string, claimAmount: number, automated: boolean, requireWhitelist: boolean) => {
    const pingTransaction = new Transaction({
      value: 0,
      data: TransactionPayload.contractCall()
        .setFunction(new ContractFunction("createCampaign"))
        .addArg(new StringValue(`${name}`))
        .addArg(new StringValue(`${media}`))
        .addArg(new StringValue(`${metadata}`))
        .addArg(new BigUIntValue(claimAmount))
        .addArg(new BooleanValue(automated))
        .addArg(new BooleanValue(requireWhitelist))
        .build(),
      sender: new Address(address),
      receiver: new Address("erd1qqqqqqqqqqqqqpgq3yf3vgw7d3avzmvpg9evfjj6pzrezgtxuyksn62mwg"),
      gasLimit: 25000000,
      chainID: "D",
    });
    await refreshAccount();

    await sendTransactions({
      transactions: pingTransaction,
      transactionsDisplayInfo: {
        processingMessage: "Adding campaign",
        errorMessage: "Campaign add error",
        successMessage: "Campaign added successfully",
      },
      redirectAfterSign: false,
    });
  };
  useEffect(() => {
    Contract.getSpace(address).then((space: any) => {
      // console.log("Test", space);
      if (space) {
        setCampaign(space?.data?.campaigns);
        setSpaceId(space?.data?.spaceId);
        // setNftImage(buildNftId(space.data.spaceId, space.data.campaigns.nonce));
        // console.log("Nonce", space);
      }
    });
    console.log(hasPendingTransactions);
  }, [address, hasPendingTransactions]);

  return (
    <div className="flex flex-col w-full">
      <h1 className="flex w-full justify-center py-3 text-xl font-semibold">Space</h1>

      <span className="font-medium pl-10 text-black/60 text-sm">Space: {spaceId}</span>

      <div className="flex flex-row justify-between">
        <span className="flex flex-row justify-center items-center font-medium pl-10 text-black/80 mt-2">Your active campains</span>
        <div className="flex flex-row justify-center items-center">
          <Button className="!my-4 !w-full !mr-10 !bg-teal-300 hover:!bg-teal-400 hover:scale-105 rounded-lg font-medium text-center" onClick={onOpen}>
            <Text>Create</Text>
            <AddIcon className="mx-2" boxSize={3} />
          </Button>
        </div>
      </div>
      {(campaign && campaign.length > 0) ?
      <div className="grid lg:grid-cols-2 xl:grid-cols-3">
        {campaign?.map((campaigns, index) => {
          const nftId = buildNftId(campaigns.spaceId, campaigns.nonce);
          return (
            <Box className="flex flex-col border-2 border-teal-300 w-fit px-4 ml-10 mt-2 rounded-lg" key={index}>
              <Box boxSize="2xs" className="my-1.5">
                <Image src={`https://devnet-api.multiversx.com/nfts/${nftId}/thumbnail`} alt="nft" />
              </Box>
              <Text>Campaign name: {campaigns.name}</Text>
              <Text>Space ID: {campaigns.spaceId}</Text>
              <Text>Claimable amount: {campaigns.claimAmount}</Text>
              <Text>
                Minted supply / Max supply: {campaigns.mintedSupply} / {campaigns.maxSupply}
              </Text>
              <Text className="mb-2">Has whitelist enabled: {campaigns.requireWhitelist ? "Yes" : "No"}</Text>
            </Box>
          );
        })}
      </div>
        :
        <div className="flex w-full h-[75dvh] justify-center items-center">
        No campaign at the moment you can create one!
        </div>
      }
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>
            <div className="flex flex-row">
              <div className="my-auto w-7 h-7 bg-teal-300 rounded-md">
                <AddIcon className="-mt-2 mx-2" boxSize={3} />
              </div>
              <p className="ml-2">Create a new campaign</p>
            </div>
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody className="flex flex-col">
            <Input className="my-2" placeholder="Name" value={name} onChange={handleNameChange} />
            <Input className="my-2" placeholder="Image URL" value={media} onChange={handleMediaChange} />
            <Input className="my-2" placeholder="Attributes" value={attributes} onChange={handleAttributesChange} />
            <Input className="my-2" placeholder="Claim amount per user" value={claimAmount} onChange={handleClaimAmount} />
            <Checkbox
              className="my-2 ml-0.5"
              value={automated}
              defaultChecked
              onChange={(e) => {
                setCheckedItems(e.target.checked);
                handleAutomated;
              }}>
              {" "}
              Redeem via KYC?
            </Checkbox>
            <Checkbox className="my-2 ml-0.5" value={requireWhitelist} defaultChecked isDisabled={checkedItems} onChange={handleRequireWhitelist}>
              Campaign require whitelist?
            </Checkbox>
          </ModalBody>
          <ModalFooter>
            <Button mr={3} onClick={onClose}>
              Close
            </Button>
            <Button className="!bg-teal-300" onClick={() => addCampaign(name, media, attributes, claimAmount, !!automated, !!requireWhitelist)}>
              Create
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </div>
  );
};

export default Space;
