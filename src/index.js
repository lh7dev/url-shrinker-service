const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");

const URLShortenerRoutes = require("./routes/url-shortener.routes").URLShortenerRoutes;
const ShortUrlRoutes = require("./routes/short-url-navigation.routes").ShortUrlRoutes;

const PORT = process.env.PORT || 4000;

const app = express();

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

app.listen(PORT, () =>
  console.log(`url-shortener-service is running on port ${PORT}`)
);
