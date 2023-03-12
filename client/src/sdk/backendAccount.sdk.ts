/**
 * This is an auto generated code. This code should not be modified since the file can be overwriten
 * if new genezio commands are executed.
 */

import { Remote } from "./remote";

export const networkProvider = new ProxyNetworkProvider("https://devnet-gateway.multiversx.com");

export class BackendAccount {
  static remote = new Remote("http://127.0.0.1:8083/BackendAccount");

  static async sync(password: string): Promise<any> {
    return await BackendAccount.remote.call("BackendAccount.sync", password);
  }

  static async sendTransaction(tokenIdentifier: string, nonce: number, address: string, password: string): Promise<any> {
    return await BackendAccount.remote.call("BackendAccount.sendTransaction", tokenIdentifier, nonce, address, password);
  }
}

export { Remote };
