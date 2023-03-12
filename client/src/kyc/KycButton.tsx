import { Address, ContractFunction, StringValue, TokenIdentifierValue, Transaction, TransactionPayload, U64Value } from "@multiversx/sdk-core/out";
import { useGetAccountInfo } from "@multiversx/sdk-dapp/hooks";
import { sendTransactions } from "@multiversx/sdk-dapp/services";
import { refreshAccount } from "@multiversx/sdk-dapp/utils";
import VerifyButton from "@passbase/button/react";
import React from "react";

type KycButtonProps = {
  spaceId: string;
  nonce: number;
};

export const KycButton = (props: KycButtonProps) => {
  const { address } = useGetAccountInfo();
  const { spaceId, nonce } = props;
  const sendKycKeyToContract = async (key: string) => {
    const sendKycTx = new Transaction({
      value: 0,
      data: TransactionPayload.contractCall()
        .setFunction(new ContractFunction("addKycKey"))
        .addArg(new TokenIdentifierValue(spaceId))
        .addArg(new U64Value(nonce))
        .addArg(new StringValue(key))
        .build(),
      sender: new Address(address),
      receiver: new Address("erd1qqqqqqqqqqqqqpgq3yf3vgw7d3avzmvpg9evfjj6pzrezgtxuyksn62mwg"),
      gasLimit: 10000000,
      chainID: "D",
    });
    await refreshAccount();

    await sendTransactions({
      transactions: sendKycTx,
      transactionsDisplayInfo: {
        processingMessage: "Sending KYC key to blockchain",
        errorMessage: "KYC key failed sending",
        successMessage: "KYC key sent successfully",
      },
      redirectAfterSign: false,
    });
  };

  return (
    <VerifyButton
      apiKey={process.env.REACT_APP_PASSBASE_KEY || ""}
      onStart={() => {
        console.log("started");
      }}
      onError={(errorCode) => {
        console.log(errorCode);
      }}
      onFinish={(identityAccessKey) => {
        sendKycKeyToContract(identityAccessKey);
      }}
    />
  );
};
