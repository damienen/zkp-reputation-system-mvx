import {
  Account,
  Address,
  ContractFunction,
  StringValue,
  Transaction,
  TransactionPayload,
} from "@multiversx/sdk-core/out";
import { ProxyNetworkProvider } from "@multiversx/sdk-network-providers/out";
import { UserSigner, UserWallet } from "@multiversx/sdk-wallet/out";
import keyStore from "../wallet.json";
import { reputationContractAddress } from "./constants";

export class BackendAccount {
  networkProvider = new ProxyNetworkProvider(
    "https://devnet-gateway.multiversx.com"
  );

  async sync(password: string) {
    let secretKey = UserWallet.decryptSecretKey(keyStore, password);
    let backendAddress = secretKey.generatePublicKey().toAddress();
    let backendAccount = new Account(backendAddress);
    let addressOnNetwork = await this.networkProvider.getAccount(
      backendAddress
    );
    backendAccount.update(addressOnNetwork);
    const backendSigner = new UserSigner(secretKey);
    return {
      address: backendAddress,
      account: backendAccount,
      signer: backendSigner,
    };
  }

  async checkKycKey(key: string, password: string) {
    let backend = await this.sync(password);
    let networkConfig = await this.networkProvider.getNetworkConfig();

    const transactionPayload = TransactionPayload.contractCall()
      .setFunction(new ContractFunction("checkKycKey"))
      .setArgs([new StringValue(key)])
      .build();

    const checkKycTransaction = new Transaction({
      value: 0,
      data: transactionPayload,
      receiver: new Address(reputationContractAddress),
      sender: new Address(backend.address.bech32()),
      gasLimit: 60000000,
      chainID: networkConfig.ChainID,
    });

    checkKycTransaction.setNonce(backend.account.getNonceThenIncrement());
    backend.signer.sign(checkKycTransaction);
    let txHash = await this.networkProvider.sendTransaction(
      checkKycTransaction
    );
    console.log(`Tx Hash: ${txHash}`);
  }
}
