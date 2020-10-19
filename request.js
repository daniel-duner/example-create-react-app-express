const dotenv = require("dotenv");
dotenv.config();
const FormData = require("form-data");
const axios = require("axios").default;
const { API_TOKEN, API_SECRET, ACCESS_TOKEN, ACCESS_SECRET } = process.env;
const apiKey = `oauth_signature_method="PLAINTEXT", oauth_consumer_key="${API_TOKEN}", oauth_token="${ACCESS_TOKEN}", oauth_signature="${
    API_SECRET + "&" + ACCESS_SECRET
}"`;
module.exports = {
  postCallFormData: async function (url, formData){
    config = {
      headers: {
        Authorization: apiKey,
        "Content-Type": `multipart/form-data;boundary=${formData._boundary}`,
      },
    };
    return await axios.post(url, formData, config);
  },

  createNewDocument: async function (file){
    const { buffer, originalname: filename } = file;
    let formData = new FormData();
    formData.append("file", buffer, { filename });
    return await this.postCallFormData(
      "https://api-testbed.scrive.com/api/v2/documents/new",
      formData
    );
  },

  updateParties: async function(id, parties){
    let formData = new FormData();
    formData.append("document", JSON.stringify({ id, parties }));
    formData.append("document_id", id);
    return await this.postCallFormData(
      `https://api-testbed.scrive.com/api/v2/documents/${id}/update`,
      formData
    );
  },
  startSigningProcess: async function(id){
    config = {
      headers: { Authorization: apiKey },
    };
    return await axios.post(
      `https://api-testbed.scrive.com/api/v2/documents/${id}/start`,
      id,
      config
    );
  },
};
