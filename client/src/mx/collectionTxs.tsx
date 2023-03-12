import {
  Address,
  AddressValue,
  ContractFunction,
  StringValue,
  TokenIdentifierValue,
  Transaction,
  TransactionPayload
} from "@multiversx/sdk-core/out";
import { sendTransactions } from "@multiversx/sdk-dapp/services";
import { refreshAccount } from "@multiversx/sdk-dapp/utils";

export const sendIssueCollectionTransaction = async (sender: string, name: string, ticker: string) => {
  const issueCollectionTx = new Transaction({
    value: 50000000000000000,
    data: TransactionPayload.contractCall()
      .setFunction(new ContractFunction("issueSemiFungible"))
      .addArg(new StringValue(`${name}`))
      .addArg(new StringValue(`${ticker}`))
      .addArg(new StringValue("canFreeze"))
      .addArg(new StringValue("true"))
      .addArg(new StringValue("canWipe"))
      .addArg(new StringValue("true"))
      .addArg(new StringValue("canPause"))
      .addArg(new StringValue("true"))
      .addArg(new StringValue("canTransferNFTCreateRole"))
      .addArg(new StringValue("true"))
      .addArg(new StringValue("canChangeOwner"))
      .addArg(new StringValue("true"))
      .addArg(new StringValue("canUpgrade"))
      .addArg(new StringValue("true"))
      .addArg(new StringValue("canAddSpecialRoles"))
      .addArg(new StringValue("true"))
      .build(),
    sender: new Address(sender),
    receiver: new Address("erd1qqqqqqqqqqqqqqqpqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqzllls8a5w6u"),
    gasLimit: 80000000,
    chainID: "D",
  });
  await refreshAccount();

  await sendTransactions({
    transactions: issueCollectionTx,
    transactionsDisplayInfo: {
      processingMessage: "Issuing collection",
      errorMessage: "Error occured during collection issuing",
      successMessage: "Collection issued successfully",
    },
    redirectAfterSign: false,
  });
};

export const sendSetSpecialRoleTransaction = async (sender: string, ticker: string) => {
  const specialRoleTx = new Transaction({
    value: 0,
    data: TransactionPayload.contractCall()
      .setFunction(new ContractFunction("setSpecialRole"))
      .addArg(new StringValue(`${ticker}`))
      .addArg(new AddressValue(new Address("erd1qqqqqqqqqqqqqpgq3yf3vgw7d3avzmvpg9evfjj6pzrezgtxuyksn62mwg")))
      .addArg(new StringValue("ESDTRoleNFTCreate"))
      .addArg(new StringValue("ESDTRoleNFTAddQuantity"))
      .addArg(new StringValue("ESDTTransferRole"))
      .addArg(new StringValue("ESDTRoleNFTBurn"))
      .build(),
    sender: new Address(sender),
    receiver: new Address("erd1qqqqqqqqqqqqqqqpqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqzllls8a5w6u"),
    gasLimit: 80000000,
    chainID: "D",
  });
  await refreshAccount();

  await sendTransactions({
    transactions: specialRoleTx,
    transactionsDisplayInfo: {
      processingMessage: "Giving contract roles",
      errorMessage: "Role giving error",
      successMessage: "Roles given successfully",
    },
    redirectAfterSign: false,
  });
};

export const createSpaceTransaction = async (sender: string, ticker: string, name: string) => {
  const createSpaceTx = new Transaction({
    value: 0,
    data: TransactionPayload.contractCall()
      .setFunction(new ContractFunction("createSpace"))
      .addArg(new TokenIdentifierValue(`${ticker}`))
      .addArg(new StringValue(name))
      .build(),
    sender: new Address(sender),
    receiver: new Address("erd1qqqqqqqqqqqqqpgq3yf3vgw7d3avzmvpg9evfjj6pzrezgtxuyksn62mwg"),
    gasLimit: 12000000,
    chainID: "D",
  });
  await refreshAccount();

  await sendTransactions({
    transactions: createSpaceTx,
    transactionsDisplayInfo: {
      processingMessage: "Creating space",
      errorMessage: "Space creation error",
      successMessage: "Space created",
    },
    redirectAfterSign: false,
  });
};
