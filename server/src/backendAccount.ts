import { Account, Address, AddressValue, ContractFunction, TokenIdentifierValue, Transaction, TransactionPayload, U64Value } from "@multiversx/sdk-core/out"
import { ProxyNetworkProvider } from "@multiversx/sdk-network-providers/out";
import { UserSigner, UserWallet } from "@multiversx/sdk-wallet/out"
import keyStore from "../wallet.json"
import { reputationContractAddress } from "./constants";
export const networkProvider = new ProxyNetworkProvider(
    "https://devnet-gateway.multiversx.com"
  );



  export class BackendAccount {

    async sync(password: string) {
        let secretKey = UserWallet.decryptSecretKey(keyStore, password)
        let backendAddress = secretKey.generatePublicKey().toAddress()
        let backendAccount = new Account(backendAddress)
        let addressOnNetwork = await networkProvider.getAccount(backendAddress)
        backendAccount.update(addressOnNetwork)
        const backendSigner = new UserSigner(secretKey)
        return {address:backendAddress, account: backendAccount, signer: backendSigner }
    }

    async sendTransaction(tokenIdentifier:string, nonce:number,address: string, password: string){

       let backend = await this.sync(password)
       let networkConfig = await networkProvider.getNetworkConfig()
       

       const transactionPayload = TransactionPayload.contractCall()
        .setFunction(new ContractFunction("whitelistParticipants"))
        .setArgs([new TokenIdentifierValue(tokenIdentifier),new U64Value(nonce),new AddressValue(new Address(address))])
        .build()

       
        const whitelistTransaction = new Transaction({
            value: 0,
            data: transactionPayload,
            receiver: new Address(reputationContractAddress),
            sender: new Address(backend.address.bech32()),
            gasLimit: 60000000,
            chainID: networkConfig.ChainID,
            });
        
            whitelistTransaction.setNonce(backend.account.getNonceThenIncrement());
            backend.signer.sign(whitelistTransaction);
            let txHash = await networkProvider.sendTransaction(whitelistTransaction)
            console.log(`Tx Hash: ${txHash}`)

        }

   
   
  }

