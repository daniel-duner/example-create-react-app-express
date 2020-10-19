const express = require("express");
const path = require("path");
const bodyParser = require("body-parser");
const service = require('./services');
const request = require('./requests');

const multer = require("multer");
const cors = require("cors");
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
    const receivingParties = service.toArray(req.body.emails);
    let response = await request.createNewDocument(req.files[0]);
    let { parties: requestingParty, id } = response.data;
    const allParties = service.prepareParties(requestingParty, receivingParties);
    response = await request.updateParties(id, allParties);
    response = await request.startSigningProcess(id);
    service.simpleLogging(response.status, response.statusText);
    res.status(200).send("Success!");
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
