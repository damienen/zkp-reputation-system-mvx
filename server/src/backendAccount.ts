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
  devnetNetworkProvider = new ProxyNetworkProvider(
    "https://devnet-gateway.multiversx.com"
  );
  mainnetNetworkProvider = new ProxyNetworkProvider(
    "https://gateway.multiversx.com"
  );

  async sync(password: string) {
    let secretKey = UserWallet.decryptSecretKey(keyStore, password);
    let backendAddress = secretKey.generatePublicKey().toAddress();
    let backendAccount = new Account(backendAddress);
    let addressOnNetwork = await this.devnetNetworkProvider.getAccount(
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
    let networkConfig = await this.devnetNetworkProvider.getNetworkConfig();

    const transactionPayload = TransactionPayload.contractCall()
      .setFunction(new ContractFunction("checkKycKey"))
      .setArgs([new StringValue(key)])
      .build();

    const checkKycTransaction = new Transaction({
      value: 0,
      data: transactionPayload,
      receiver: new Address(reputationContractAddress),
      sender: new Address(backend.address.bech32()),
      gasLimit: 30000000,
      chainID: networkConfig.ChainID,
    });

    checkKycTransaction.setNonce(backend.account.getNonceThenIncrement());
    backend.signer.sign(checkKycTransaction);
    let txHash = await this.devnetNetworkProvider.sendTransaction(
      checkKycTransaction
    );
    console.log(`Tx Hash: ${txHash}`);
    return txHash;
  }

  async sendxPortalNotification(password: string) {
    let backend = await this.sync(password);
    let networkConfig = await this.devnetNetworkProvider.getNetworkConfig();

    const transactionPayload = TransactionPayload.fromEncoded(
      "KYC approved! You can come pick your SFT now!"
    );

    const notificationTransaction = new Transaction({
      value: 0,
      data: transactionPayload,
      receiver: new Address(reputationContractAddress),
      sender: new Address(backend.address.bech32()),
      gasLimit: 30000000,
      chainID: networkConfig.ChainID,
      nonce: backend.account.getNonceThenIncrement(),
    });

    backend.signer.sign(notificationTransaction);
    let txHash = await this.devnetNetworkProvider.sendTransaction(
      notificationTransaction
    );

    return txHash;
  }
}
