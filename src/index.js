import express from "express";
import bodyParser from "body-parser";
import mongoose from "mongoose";
import cors from "cors";

import { URLShortenerRoutes } from "./routes/url-shortener.routes";
import { ShortUrlRoutes } from "./routes/short-url-navigation.routes";

const PORT = process.env.PORT || 4000;

const conf = require("../config.json");
const DB_NAME = conf.database.name;
const DB_URL = conf.database.url;
const DB_PORT = conf.database.port;

const app = express();

// database connection
mongoose.Promise = global.Promise;
mongoose.connect(`mongodb://${DB_URL}:${DB_PORT}/${DB_NAME}`, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

app
  .use(
    cors({
      origin: true,
    })
  )
  .use(bodyParser.json())
  .use(
    bodyParser.urlencoded({
      extended: true,
    })
  )
  .use("/url_shortener", URLShortenerRoutes)
  .use("/", ShortUrlRoutes)
  .get("*", (_, res) => {
    res.status(404).json({
      success: false,
      error: "Endpoint not found",
    });
  });

app.listen(PORT, () => console.log(`url-shortener-service is running on port ${PORT}`));
