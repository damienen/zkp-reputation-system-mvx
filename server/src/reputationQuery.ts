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
import { reputationContractAddress } from "./constants";

export class Contract {
  json = JSON.parse(JSON.stringify(jsonData));
  abiRegistry = AbiRegistry.create(this.json);
  abi = new SmartContractAbi(this.abiRegistry, ["Reputation"]);
  networkProvider = new ProxyNetworkProvider(
    "https://devnet-gateway.multiversx.com"
  );

  contract = new SmartContract({
    address: new Address(reputationContractAddress),
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
      const returnValue = firstValueAsStruct.valueOf();
      console.log(returnValue);
      return {
        data: {
          spaceId: returnValue["space"]["space_id"].toString(),
          spaceName: returnValue["space"]["name"].toString(),
          campaigns: returnValue["campaigns"].map((campaign: any) => {
            return {
              spaceId: returnValue["space"]["space_id"].toString(),
              nonce: campaign["nonce"].toNumber(),
              name: campaign["name"].toString(),
              claimAmount: campaign["claim_amount"].toNumber(),
              maxSupply: campaign["max_supply"].toNumber(),
              mintedSupply: campaign["minted_supply"].toNumber(),
              startTimestamp: campaign["start"].toNumber(),
              endTimestamp: campaign["end"].toNumber(),
              creationDate: campaign["create_date"].toNumber(),
              requireWhitelist: campaign["require_whitelist"].toNumber(),
            };
          }),
        },
      };
    } else {
      return { data: {} };
    }
  }
}
