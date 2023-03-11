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
}
