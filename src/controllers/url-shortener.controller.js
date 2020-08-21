const model = require("../models/url-shortener.models");
const shortId = require("shortid");
const dbRepo = require("../firestore_repo/firesotoreDB");
const COLLECTION_NAME = "urls";

const getUrls = async () => {
  var snapshot = null;
  const data = [];
  try {
    snapshot = await dbRepo.getAllDocs(COLLECTION_NAME);

    snapshot.forEach((doc) => {
      const d = doc.data();
      data.push({
        id: doc.id,
        originalUrl: d.originalUrl,
        shortUrl: d.shortUrl,
        totalValidDays: d.totalValidDays,
        createdOn: d.createdOn,
      });
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err });
  }

  return data;
};

const shrinkUrl = async (req, res) => {
  var shortUrl;
  var validShortUrl = false;

  const urls = await getUrls(shortUrl);
  console.log(urls);

  do {
    // get currently active short urls

    shortUrl = shortId.generate();
    validShortUrl = await isShortUrlUnique(shortUrl, urls);
  } while (!validShortUrl);

  console.log(req.body.url);

  model.originalUrl = req.body.url;
  model.shortUrl = shortUrl;
  model.createdOn = new Date();
  model.totalValidDays = req.body.totalValidDays;

  dbRepo
    .createDoc(COLLECTION_NAME, model)
    .then(() => {
      console.log("SUCCESS: document created in collection " + COLLECTION_NAME);
      const responseData = { success: true, data:model };
      res.json(responseData);
    })
    .catch((e) => {
      console.log(
        "ERROR: document could not be created collection " + COLLECTION_NAME
      );
      console.log(e);
      const responseData = { success: false, error: e };

      res.status(500).json(responseData);
    });
};

const listUrlRecords = async (req, res) => {
  dbRepo
    .getAllDocs(COLLECTION_NAME)
    .then((snapshot) => {
      const data = [];
      snapshot.forEach((doc) => {
        const d = doc.data();
        data.push(d);
      });

      console.log(data);

      res.json({ success: true, data });
    })
    .catch((e) => {
      console.log("ERROR: getting collection " + COLLECTION_NAME);
      console.log(e);
      const responseData = { success: false, error: e };

      res.status(500).json(responseData);
    });
};

const isShortUrlUnique = async (shortUrl, collection) => {
  const result = collection.filter((x) => x.shortUrl === shortUrl);

  const currentDate = new Date();

  console.log(currentDate.getDate() + 365);

  if (result.length === 0) {
    return true;
  } else if (result[0].totalValidDays === -1) {
    return false;
  } else if (
    currentDate <=
    result[0].createdOn.getDate() + result[0].totalValidDays
  ) {
    return false;
  } else if (
    currentDate >
    result[0].createdOn.getDate() + result[0].totalValidDays
  ) {
    try {
      await dbRepo.deleteDoc(COLLECTION_NAME, result[0].id);
      return true;
    } catch (err) {
      return false;
    }
  } else {
    return false;
  }
};

module.exports = {
  shrinkUrl,
  listUrlRecords,
};
