require("dotenv").config();
const express = require("express");
const axios = require("axios");
const app = express();
const bodyParser = require("body-parser");
const cors = require("cors");
const corsOptions = {
  origin: ["*"],
  credentials: true,
  optionsSuccessStatus: 200,
};
app.use(cors(corsOptions));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

const API_URL = process.env.BLAST_API_URL;

import { Address } from "@multiversx/sdk-core/out";

export class Server {
  checkInternalServerHealth() {
    return { data: "hello" };
  }
}

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
