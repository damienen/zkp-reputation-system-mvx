import {
  AbiRegistry,
  Address,
  AddressValue,
  ResultsParser,
  SmartContract,
  SmartContractAbi,
  VariadicValue,
} from "@multiversx/sdk-core";
import { ProxyNetworkProvider } from "@multiversx/sdk-network-providers/out";
import jsonData from "../reputation.abi.json";

export class Contract {
  json = JSON.parse(JSON.stringify(jsonData));
  abiRegistry = AbiRegistry.create(this.json);
  abi = new SmartContractAbi(this.abiRegistry, ["Reputation"]);
  networkProvider = new ProxyNetworkProvider(
    "https://devnet-gateway.multiversx.com"
  );

  contract = new SmartContract({
    address: new Address("erd1..."),
    abi: this.abi,
  });

  async getSpace(address: string) {
    const interaction = this.contract.methodsExplicit.viewSpace([
      new AddressValue(new Address(address)),
    ]);
    const query = interaction.buildQuery();
    const queryResponse = await this.networkProvider.queryContract(query);
    const endpointDefinition = interaction.getEndpoint();
    const { firstValue, returnCode } = new ResultsParser().parseQueryResponse(
      queryResponse,
      endpointDefinition
    );
    if (returnCode.isSuccess()) {
      let firstValueAsStruct = firstValue as VariadicValue;
      firstValueAsStruct = firstValue?.valueOf();
      return { data: firstValueAsStruct };
    } else {
      return { data: {} };
    }
  }
}
