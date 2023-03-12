import {
  AbiRegistry,
  Address,
  AddressValue,
  ResultsParser,
  SmartContract,
  SmartContractAbi,
  StringValue,
  TokenIdentifierValue,
  U64Value,
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

  private mapCampaign(campaign: any) {
    return {
      spaceId: campaign["space_id"].toString(),
      nonce: campaign["nonce"].toNumber(),
      name: campaign["name"].toString(),
      claimAmount: campaign["claim_amount"].toNumber(),
      maxSupply: campaign["max_supply"].toNumber(),
      mintedSupply: campaign["minted_supply"].toNumber(),
      startTimestamp: campaign["start"].toNumber(),
      endTimestamp: campaign["end"].toNumber(),
      creationDate: campaign["created_date"].toNumber(),
      requireWhitelist: !!campaign["require_whitelist"],
      automated: !!campaign["automated"],
    };
  }

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
            return this.mapCampaign(campaign);
          }),
        },
      };
    } else {
      return { data: {} };
    }
  }

  async getClaims(address: string) {
    const interaction = this.contract.methodsExplicit.viewClaims([
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
          campaigns: returnValue.map((claim: any) => {
            return {
              ...this.mapCampaign(claim["campaign"]),
              amount: claim["amount"].toNumber(),
            };
          }),
        },
      };
    } else {
      return { data: {} };
    }
  }
  async getIndividualCampaign(
    tokenIdentifier: string,
    nonce: number,
    address: string
  ) {
    const interaction = this.contract.methodsExplicit.getIndividualCampaign([
      new TokenIdentifierValue(tokenIdentifier),
      new U64Value(nonce),
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
          campaign: this.mapCampaign(returnValue["campaign"]),
          amount: returnValue["amount"].toNumber(),
          whitelisted: !!returnValue["whitelisted"],
          claimed: !!returnValue["claimed"],
        },
      };
    } else {
      return { data: {} };
    }
  }

  async getKycNotification(key: string) {
    const interaction = this.contract.methodsExplicit.getKycNotification([
      new StringValue(key),
    ]);
    const query = interaction.buildQuery();
    const queryResponse = await this.networkProvider.queryContract(query);
    const endpointDefinition = interaction.getEndpoint();
    const { firstValue, returnCode } = new ResultsParser().parseQueryResponse(
      queryResponse,
      endpointDefinition
    );

    if (returnCode.isSuccess()) {
      let firstValueAsStruct = firstValue as AddressValue;
      const returnValue = firstValueAsStruct.valueOf();
      console.log(returnValue);
      return {
        dadta: returnValue,
      };
    } else {
      return { data: {} };
    }
  }
}
