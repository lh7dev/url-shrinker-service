import { UrlRegistry } from "../models/url-shortener.models";

export const redirectToOriginal = (url, res) => {
    const shortUrl = {shortUrl: url};
    UrlRegistry.findOne(shortUrl).exec((err, result)=>{
        if(err) {
            res.status(500).json({ success: false, error: "Internal Server Error" });
        } else {
            if(!result){
                res.status(404).json({ success: false, error: "Url not found" });
            } else {
                res.redirect(result.originalUrl);
            }
        }
    });
};



