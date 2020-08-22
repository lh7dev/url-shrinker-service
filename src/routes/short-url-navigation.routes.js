const express = require("express");
const redirectToOriginal = require("../controllers/short-url-navigation.controller");
 

const router = express.Router();

// Takes the short url and redirects to original
router.get("/:shortUrl", (req, res) => {
    const shortUrl = req.params.shortUrl;
  redirectToOriginal(shortUrl, res);
});

module.exports = {
  ShortUrlRoutes: router
}
