import { AbiRegistry, Address, AddressValue, ContractFunction, IAddress, SmartContract, SmartContractAbi } from "@multiversx/sdk-core";
import jsonData from '../reputation.abi.json';




export class Contract {

   json = JSON.parse(JSON.stringify(jsonData));
   abiRegistry = AbiRegistry.create(this.json);
   abi = new SmartContractAbi(this.abiRegistry, ["Reputation"]);

   contract = new SmartContract({ address: new Address("erd1..."), abi: this.abi });
    
    getSpace(address: Address) {
      let query = this.contract.createQuery({
        func: new ContractFunction("getClaimableRewards"),
        args: [new AddressValue(address)],
    });
    
    let queryResponse = await networkProvider.queryContract(query);
    let bundle = resultsParser.parseUntypedQueryResponse(queryResponse);
    console.log(bundle.returnCode);
    console.log(bundle.returnMessage);
    console.log(bundle.values); 

      return { data: "hello" };
    }
  }
  