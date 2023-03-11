const axios = require("axios");
const API_URL = process.env.BLAST_API_URL;

import { Address } from "@multiversx/sdk-core/out";
export class MultiversXApi {
  async checkMultiversXApiHealth() {
    const hello = await axios.get(`${API_URL}/hello`);
    return { data: hello.data };
  }

  async getCollectionsAddressOwns(stringAddress: string) {
    const address = new Address(stringAddress);
    let collections = await axios.get(
      `${API_URL}/accounts/${address}/roles/collections`
    );
    collections = collections.data.filter(
      (collection: any) => collection.owner === address.bech32()
    );
    return { data: collections.data };
  }
}
