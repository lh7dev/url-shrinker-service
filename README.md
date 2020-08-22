# Project Description
Node/Express API that allows user to shrink URLs.

## Endpoint
Request Type | endpoint | Description
------------ | ------------- | -------------
GET | /:shortUrl | Redirects request to corresponding URL
GET | /url_shortener | Returns a urls collection
POST | /url_shortener/shrink_url | - Adds new registry to urls collection. <br> - Expects object within the body of the request <br> ```{url:"https://this_is_the_url_to_shrink.com", totalValidDays: 365}```

## Deployment to firebase functions

1. Install firebase-tools
    - ```$ npm install -g firebase-tools```

2. Create a directory for you project and navigate to it
    - ```$ mkdir xyz-service```
    - ```$ cd xyz-service```

3. If you are not logged in, you will need to run
    - ```$ firebase login```


4. Initialize firebase project (Use the "Functions" option during this process)
    - ```$ firebase init```

5. Go inside the "functions" folder and clone this repo
    - ```$ cd functions```
    - ```$ git clone https://github.com/lh7dev/url-shrinker-service.git```

6. Point function to service index
    - Open file /functions/index.js and add the following code
    ```
        const server = require("./url-shrinker-api/src/index");
        const api = functions.https.onRequest(server);
        module.exports = {api};
    ```

7. Deploy firebase function
    - From the root directory of the project execute the following command
    - ```$ firebase deploy```

**NOTE:** 
* You may want to test this project locally. To do this, make sure to install the dependencies by running ```$ npm install``` from the root folder.
To start a development environment run ```$ firebase serve```
