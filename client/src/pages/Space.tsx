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
import { useGetAccountInfo } from "@multiversx/sdk-dapp/hooks";
import React, { useEffect, useState } from "react";
import { Contract } from "sdk/contract.sdk";
import { Campaign } from "../util/types";

export const Space = () => {
  const { address } = useGetAccountInfo();
  const [ceva, setCeva] = useState<Campaign[]>([]);
  const [spaceId, setSpaceId] = useState("");
  const [nftImage, setNftImage] = useState("");
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [checkedItems, setCheckedItems] = useState(true);

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
        <span className="flex flex-row justify-center items-center font-medium pl-10 text-black/80 mt-2">Your active campains</span>
        <div className="flex flex-row justify-center items-center">
          <Button className="!my-4 !w-full !mr-10 !bg-teal-300 hover:!bg-teal-400 hover:scale-105 rounded-lg font-medium text-center" onClick={onOpen}>
            <Text>Create</Text>
            <AddIcon className="mx-2" boxSize={3} />
          </Button>
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
            <Input className="my-2" placeholder="Name" />
            <Input className="my-2" placeholder="Image URL" />
            <Input className="my-2" placeholder="Attributes" />
            <Input className="my-2" placeholder="Claim amount per user" />
            <Checkbox className="my-2 ml-0.5" defaultChecked onChange={(e) => setCheckedItems(e.target.checked)}>
              Redeem via KYC?
            </Checkbox>
            <Checkbox className="my-2 ml-0.5" defaultChecked isDisabled={checkedItems}>
              Campaign require whitelist?
            </Checkbox>
          </ModalBody>
          <ModalFooter>
            <Button mr={3} onClick={onClose}>
              Close
            </Button>
            <Button className="!bg-teal-300">Create</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </div>
  );
};

export default Space;
