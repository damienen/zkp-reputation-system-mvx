import React, { useEffect, useState } from "react";
import {
  Box,
  Button,
  Image,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  Text,
  useDisclosure
} from "@chakra-ui/react";
import { Campaign } from "../util/types";
import { buildNftId } from "../util/functions";
import { useGetAccountInfo, useGetPendingTransactions } from "@multiversx/sdk-dapp/hooks";
import { Contract } from "../sdk/contract.sdk";
import { ArrowDownIcon } from "@chakra-ui/icons";
import {
  Address,
  BigUIntValue,
  ContractFunction,
  StringValue,
  Transaction,
  TransactionPayload
} from "@multiversx/sdk-core/out";
import { refreshAccount } from "@multiversx/sdk-dapp/utils";
import { sendTransactions } from "@multiversx/sdk-dapp/services";

export const Claims = () => {
  const { address } = useGetAccountInfo();
  const [campaign, setCampaign] = useState<Campaign[]>([]);
  const { hasPendingTransactions } = useGetPendingTransactions();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [modalProps, setModalProps] = useState<{spaceId: string, nonce: number, nftId: string, name: string, amount: number}>();

  const claimCampaign = async (spaceId: string | undefined, nonce: number | undefined) => {
    const pingTransaction = new Transaction({
      value: 0,
      data: TransactionPayload.contractCall()
        .setFunction(new ContractFunction("claim"))
        .addArg(new StringValue(`${spaceId}`))
        .addArg(new BigUIntValue(nonce ?? 0))
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
        processingMessage: "Claiming reputation",
        errorMessage: "Claiming error",
        successMessage: "Claiming reputation successfully",
      },
      redirectAfterSign: false,
    });
  };

  useEffect(() => {
    Contract.getClaims(address).then((space: any) => {
      console.log("Test", space);
      if (space) {
        setCampaign(space?.data.campaigns);
      } else {
        return;
      }
    });
    console.log(hasPendingTransactions);
  }, [address, hasPendingTransactions]);

  return (
    <div className="flex flex-col w-full">
      <h1 className="flex w-full justify-center py-3 text-xl font-semibold">Claims</h1>
      {(campaign && campaign.length > 0) ?
      <div className="grid lg:grid-cols-2 xl:grid-cols-3">
        {campaign?.map((campaigns, index) => {
         const nftId = buildNftId(campaigns.spaceId, campaigns.nonce);
          console.log(nftId);
          return (
            <Box className="flex flex-col border-2 border-teal-300 w-fit px-4 ml-10 mt-2 rounded-lg" key={index}>
              <Box boxSize="2xs">
                <Image src={`https://devnet-api.multiversx.com/nfts/${nftId}/thumbnail`} alt="nft" />
              </Box>
              <Text>Campaign name: {campaigns.name}</Text>
              <Text>Space ID: {campaigns.spaceId}</Text>
              <Text>Claimable amount: {campaigns.claimAmount}</Text>
              <Text>
                Minted supply / Max supply: {campaigns.mintedSupply} / {campaigns.maxSupply}
              </Text>
              <Text className="mb-2">Has whitelist enabled: {campaigns.requireWhitelist ? "Yes" : "No"}</Text>
              <Button className="!my-2 !w-full !mr-10 !bg-teal-300 hover:!bg-teal-400 hover:scale-105 rounded-lg font-medium text-center"
                      onClick={() => {
                        setModalProps({
                          spaceId: campaigns?.spaceId,
                          nonce: campaigns?.nonce,
                          nftId: nftId,
                          name: campaigns?.name,
                          amount: campaigns.claimAmount
                        });
                        onOpen();
                      }}>CLAIM</Button>
            </Box>
          );
        })}
      </div>
        :
        <div className="flex w-full h-[75dvh] justify-center items-center">
          Nothing to claim at the moment!
        </div>
      }

      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>
            <div className="flex flex-row">
              <div className="my-auto w-7 h-7 bg-teal-300 rounded-md">
                <ArrowDownIcon className="-mt-2 mx-2" boxSize={3} />
              </div>
              <p className="ml-2">Claim reward</p>
            </div>
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody className="flex flex-col">
            <Box className="flex flex-col border-2 border-teal-300 w-fit px-4 my-2 !mx-auto rounded-lg">
              <Box boxSize="2xs">
                <Image src={`https://devnet-api.multiversx.com/nfts/${modalProps?.nftId}/thumbnail`} alt="nft" />
              </Box>
              <Text>Campaign name: {modalProps?.name}</Text>
              <Text>Amount: {modalProps?.amount}</Text>
              <Button className="my-2 !bg-teal-300" onClick={() => {
                claimCampaign(modalProps?.spaceId, modalProps?.nonce);
                onClose();
              }}>
                CLAIM
              </Button>
            </Box>
          </ModalBody>
        </ModalContent>
      </Modal>

    </div>
  );
};

export default Claims;
