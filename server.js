const express = require("express");
const path = require("path");
const bodyParser = require("body-parser");
const dotenv = require("dotenv");
const validator = require("email-validator");
dotenv.config();
const { API_TOKEN, API_SECRET, ACCESS_TOKEN, ACCESS_SECRET } = process.env;
const apiKey = `oauth_signature_method="PLAINTEXT", oauth_consumer_key="${API_TOKEN}", oauth_token="${ACCESS_TOKEN}", oauth_signature="${
  API_SECRET + "&" + ACCESS_SECRET
}"`;

const multer = require("multer");
const FormData = require("form-data");
const axios = require("axios").default;
const cors = require("cors");
const upload = multer();
const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));


postCallFormData = async (url, formData) => {
  config = {
    headers: {
      "Authorization": apiKey,
      "Content-Type": `multipart/form-data;boundary=${formData._boundary}`,
    },
  };
  return await axios.post(url, formData, config);
};

createNewDocument = async (file) => {
  const { buffer, originalname: filename } = file;
  let formData = new FormData();
  formData.append("file", buffer, { filename });
  return await postCallFormData(
    "https://api-testbed.scrive.com/api/v2/documents/new",
    formData
  );
};

updateParties = async (id, parties) => {
  let formData = new FormData();
  formData.append("document", JSON.stringify({ id, parties }));
  formData.append("document_id", id);
  return await postCallFormData(
    `https://api-testbed.scrive.com/api/v2/documents/${id}/update`,
    formData
  );
};

startSigningProcess = async (id) => {
  config = {
    headers: { "Authorization": apiKey },
  };
  return await axios.post(
    `https://api-testbed.scrive.com/api/v2/documents/${id}/start`,
    id,
    config
  );
};

validateParty = (party, res) => {
  if(!party){
    res.status(400);
  }else if(!Array.isArray(party)){
    party = [party];
  } 
  for(var i = 0; i < party.length;i++){
    if(!validator.validate(party[i])){
      res.status(400);
    }
  }
  return party;
}

app.post("/api/documents/start", upload.any(), async (req, res, next) => {
  let signingParties = validateParty(req.body.email, res);
  try {
    let response = await createNewDocument(req.files[0]);
      let { parties: requestParty, id } = response.data;
      let allParties = [...requestParty]
      for(let i = 0; i < signingParties.length;i++){
        allParties = [...allParties,{ fields: [{ type: "email", value: signingParties[i] }]}];
      }
      console.log(allParties)
      response = await updateParties(id, allParties);
      response = await startSigningProcess(id);
      res.status(200).send({ err: "SUCCESS" });
  } catch (error) {
    res.send({ err: error.message });
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
