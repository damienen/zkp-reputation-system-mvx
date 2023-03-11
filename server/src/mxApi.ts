require("dotenv").config();
const axios = require("axios");
import { api_url } from "./constants";

import { Address } from "@multiversx/sdk-core/out";
export class MultiversXApi {
  async checkMultiversXApiHealth() {
    const hello = await axios.get(`${api_url}/hello`);
    return { data: hello.data };
  }

  async getCollectionsAddressOwns(stringAddress: string) {
    const address = new Address(stringAddress);
    try {
      let collections = await axios.get(
        `${api_url}/accounts/${address}/roles/collections`
      );
      collections = collections.data.filter((collection: any) => {
        return collection.owner === address.bech32();
      });
      return { data: collections };
    } catch (error) {
      return { data: [] };
    }
  }
}
