require("dotenv").config();
const axios = require("axios");
import { apiUrl } from "./constants";

import { Address } from "@multiversx/sdk-core/out";
export class MultiversXApi {
  async checkMultiversXApiHealth() {
    const hello = await axios.get(`${apiUrl}/hello`);
    return { data: hello.data };
  }

  async getCollectionsAddressOwns(stringAddress: string) {
    const address = new Address(stringAddress);
    try {
      let collections = await axios.get(
        `${apiUrl}/accounts/${address}/roles/collections`
      );
      collections = collections.data.filter((collection: any) => {
        return collection.owner === address.bech32();
      });
      return { data: collections };
    } catch (error) {
      return { data: [] };
    }
  }

  async getLastCollectionCreated(stringAddress: string) {
    const address = new Address(stringAddress);
    try {
      let collection = await axios.get(
        `${apiUrl}/accounts/${address}/roles/collections`
      );
      collection = collection.data.filter((collection: any) => {
        return collection.owner === address.bech32();
      })[0];
      return { data: collection };
    } catch (error) {
      return { data: [] };
    }
  }
}
