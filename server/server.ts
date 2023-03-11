require("dotenv").config();
const express = require("express");
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

// basic endpoint to check server works as expected
export class Server {
  checkHealth(): any {
    return "Server is up and running";
  }
}
