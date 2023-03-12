/**
* This is an auto generated code. This code should not be modified since the file can be overwriten 
* if new genezio commands are executed.
*/
     
import { Remote } from "./remote"



export class Contract {
    static remote = new Remote("http://127.0.0.1:8083/Contract")

    static async mapCampaign(campaign: any): Promise<any> {
        return await Contract.remote.call("Contract.mapCampaign", campaign)  
  }

  static async getSpace(address: string): Promise<any> {
        return await Contract.remote.call("Contract.getSpace", address)  
  }

  static async getClaims(address: string): Promise<any> {
        return await Contract.remote.call("Contract.getClaims", address)  
  }

  static async getIndividualCampaign(tokenIdentifier: string, nonce: number, address: string): Promise<any> {
        return await Contract.remote.call("Contract.getIndividualCampaign", tokenIdentifier, nonce, address)  
  }

  

}

export { Remote };
