/**
* This is an auto generated code. This code should not be modified since the file can be overwriten 
* if new genezio commands are executed.
*/
     
import { Remote } from "./remote"



export class MultiversXApi {
    static remote = new Remote("http://127.0.0.1:8083/MultiversXApi")

    static async checkMultiversXApiHealth(): Promise<any> {
        return await MultiversXApi.remote.call("MultiversXApi.checkMultiversXApiHealth")  
  }

  static async getCollectionsAddressOwns(stringAddress: string): Promise<any> {
        return await MultiversXApi.remote.call("MultiversXApi.getCollectionsAddressOwns", stringAddress)  
  }

  

}

export { Remote };
