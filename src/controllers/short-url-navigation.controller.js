const model = require("../models/url-shortener.models");
const db = require("../firestore_repo/firesotoreDB");
const COLLECTION_NAME = "urls";

const redirectToOriginal = async (shortUrl, res) => {
  const snapshot = await db.queryDocs(COLLECTION_NAME, "shortUrl", shortUrl);
  if (snapshot.empty) {
    res.status(404).json({ success: false, error: "Url not found" });
  } else {
    const resultArray = [];

    snapshot.forEach((doc) => {
      resultArray.push(doc.data());
    });
    
    const data = resultArray[0];
    const originalUrl = data.originalUrl;
    
    res.redirect(originalUrl);
  }
};

module.exports = redirectToOriginal;
