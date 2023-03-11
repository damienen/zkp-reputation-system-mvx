/**
* This is an auto generated code. This code should not be modified since the file can be overwriten 
* if new genezio commands are executed.
*/
     
import { Remote } from "./remote"



export class Server {
    static remote = new Remote("http://127.0.0.1:8083/Server")

    static async checkInternalServerHealth(): Promise<any> {
        return await Server.remote.call("Server.checkInternalServerHealth")  
  }

  static async checkMultiversXApiHealth(): Promise<any> {
        return await Server.remote.call("Server.checkMultiversXApiHealth")  
  }

  

}

export { Remote };
