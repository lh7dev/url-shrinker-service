import { UrlRegistry } from "../models/url-shortener.models";
import shortId from "shortid";

export const shrinkUrl = async (req, res) => {
  var shortUrl;
  var validShortUrl = false;

  do {
    shortUrl = shortId.generate();
    validShortUrl = await isShortUrlUnique(shortUrl);
  } while (!validShortUrl);

  const originalUrl = { originalUrl: req.body.url, shortUrl};
  const model = new UrlRegistry(originalUrl);

  model.save((err, result) => {
    if (err) {
      if (err.code === 11000) {
        //error for duplicates
        getRecordByOriginal(req, res);
        console.log("dups");
      } else {
        console.log(err);
        res
          .status(500)
          .json({ success: false, error: "Internal Server Error" });
      }
    } else {
      res.json({ success: true, data: result });
    }
  });
};

export const getRecordByOriginal = (req, res) => {
  const originalUrl = { originalUrl: req.body.url };
  const model = new UrlRegistry(originalUrl);

  UrlRegistry.findOne(originalUrl).exec((err, result) => {
    if (err) {
      console.log(err);
      res.status(500).json({ success: false, error: "Internal Server Error" });
    } else {
      res.json({ sucees: true, data: result });
    }
  });
};

export const listUrlRecords = (req, res) => {
  UrlRegistry.find().exec((err, result) => {
    if (err) {
      res.send(500).json({ success: false, error: "Internal server error" });
    } else {
      res.json({ success: true, data: result });
    }
  });
};

const isShortUrlUnique = async (shortUrl) => {
  const result = await UrlRegistry.find({shortUrl: shortUrl}).exec();

  return result.length===0 ? true : false;
};
