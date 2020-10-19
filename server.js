const express = require("express");
const path = require("path");
const bodyParser = require("body-parser");
//const dotenv = require("dotenv");
//const validator = require("email-validator");
//dotenv.config();
/*
const { API_TOKEN, API_SECRET, ACCESS_TOKEN, ACCESS_SECRET } = process.env;
const apiKey = `oauth_signature_method="PLAINTEXT", oauth_consumer_key="${API_TOKEN}", oauth_token="${ACCESS_TOKEN}", oauth_signature="${
  API_SECRET + "&" + ACCESS_SECRET
}"`;*/
const service = require('./service');
const request = require('./request');

const multer = require("multer");
//const FormData = require("form-data");
//const axios = require("axios").default;
const cors = require("cors");
//const { sign } = require("crypto");
const upload = multer();
const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.post("/api/documents/start", upload.any(), async (req, res, next) => {
  if(!service.validateParty(req.body.emails)){
    res.status(400).send("Invalid email address");
    service.simpleLogging(400, "Invalid email address");
    return;
  };
  try {
    let signingParties = service.toArray(req.body.emails);
    let response = await request.createNewDocument(req.files[0]);
    let { parties: requestParty, id } = response.data;
    let allParties = [...requestParty];
    for(let i = 0; i < signingParties.length;i++){
      allParties = [...allParties,{ fields: [{ type: "email", value: signingParties[i] }]}];
    }
    response = await request.updateParties(id, allParties);
    response = await request.startSigningProcess(id);
    service.simpleLogging(response.status, response.statusText);
    res.status(200).send("Success! Signing process has started, check your email");
  } catch (error) {
    service.simpleLogging(error.response.status, error.response.statusText);
    res.status(error.response.status).send(error.message);
  }
});

if (process.env.NODE_ENV === "production") {
  // Serve any static files
  app.use(express.static(path.join(__dirname, "client/build")));

  // Handle React routing, return all requests to React app
  app.get("*", function (req, res) {
    res.sendFile(path.join(__dirname, "client/build", "index.html"));
  });
}

app.listen(port, () => console.log(`Listening on port ${port}`));
