const express = require("express");
const shrinkerCtrl = require("../controllers/url-shortener.controller");

const router = express.Router();

// Request Validation Middleware
const validateRequest = (req, res, next) => {
  const requestType = req.method;
  const payload = req.body.url;

  if (requestType === "POST" && !payload) {
    res.status(401).send({ success: false, error: "invalid request" });
  } else {
    next();
  }
};

router.use(validateRequest);

// Returns a list of urls
router.get("/", (req, res) => {
  shrinkerCtrl.listUrlRecords(req, res);
});

// Takes original URL and shrink it
router.post("/shrink_url", (req, res) => {
  shrinkerCtrl.shrinkUrl(req, res);
});

module.exports = {
  URLShortenerRoutes: router
} 
