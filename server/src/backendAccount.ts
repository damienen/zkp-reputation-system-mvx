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
  async syncDevnet(password: string) {
    const devnetNetworkProvider = new ProxyNetworkProvider(
      "https://devnet-gateway.multiversx.com"
    );
    let secretKey = UserWallet.decryptSecretKey(keyStore, password);
    let backendAddress = secretKey.generatePublicKey().toAddress();
    let backendAccount = new Account(backendAddress);
    let addressOnNetwork = await devnetNetworkProvider.getAccount(
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

  async syncMainnet(password: string) {
    const devnetNetworkProvider = new ProxyNetworkProvider(
      "https://gateway.multiversx.com"
    );
    let secretKey = UserWallet.decryptSecretKey(keyStore, password);
    let backendAddress = secretKey.generatePublicKey().toAddress();
    let backendAccount = new Account(backendAddress);
    let addressOnNetwork = await devnetNetworkProvider.getAccount(
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
    const devnetNetworkProvider = new ProxyNetworkProvider(
      "https://devnet-gateway.multiversx.com"
    );
    let backend = await this.syncDevnet(password);
    let networkConfig = await devnetNetworkProvider.getNetworkConfig();

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
    let txHash = await devnetNetworkProvider.sendTransaction(
      checkKycTransaction
    );
    console.log(`Tx Hash: ${txHash}`);
    return txHash;
  }

  async sendxPortalNotification(receiver: Address, password: string) {
    const mainnetNetworkProvider = new ProxyNetworkProvider(
      "https://gateway.multiversx.com"
    );
    let backend = await this.syncMainnet(password);
    let networkConfig = await mainnetNetworkProvider.getNetworkConfig();

    const transactionPayload = new TransactionPayload(
      "KYC approved! You can come pick your SFT now!"
    );

    const notificationTransaction = new Transaction({
      value: 0,
      data: transactionPayload,
      receiver: receiver,
      sender: new Address(backend.address.bech32()),
      gasLimit: 30000000,
      chainID: networkConfig.ChainID,
    });

    notificationTransaction.setNonce(backend.account.getNonceThenIncrement());
    backend.signer.sign(notificationTransaction);
    let txHash = await mainnetNetworkProvider.sendTransaction(
      notificationTransaction
    );

    return txHash;
  }
}
