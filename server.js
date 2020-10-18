const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const dotenv = require('dotenv');
dotenv.config();
const {API_TOKEN, API_SECRET, ACCESS_TOKEN, ACCESS_SECRET} = process.env;
const apiKey = `oauth_signature_method="PLAINTEXT", oauth_consumer_key="${API_TOKEN}", oauth_token="${ACCESS_TOKEN}",  oauth_signature="${API_SECRET+"&"+ACCESS_SECRET}"`

const multer = require('multer');
const FormData = require('form-data');
const axios = require('axios').default;
const cors = require('cors');

const upload = multer();
const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.post('/api/documents/new', upload.any(), async (req, res, next) => {
  const { files } = req;
  const { buffer, originalname: filename } = files[0];
  const data = new FormData();
  data.append('file', buffer, { filename });
  const url = 'https://api-testbed.scrive.com/api/v2/documents/new';
  const config = {
    headers: {
      'Authorization': apiKey,
      'Content-Type': `multipart/form-data;boundary=${data._boundary}`
    }
  };
  try{
    const response = await axios.post(url, data, config)
    const {id, parties, statusCode} = response.data
    res.send({statusCode, id, parties});
  } catch(error){
    console.log(error);
    res.send(error);
  }
});

app.post('/api/documents/update', async (req, res, next) => {
  const {parties, id} = req.body;
  const data = new FormData();
  data.append('document', JSON.stringify({id, parties}));
  data.append('document_id', id);
  const url = `https://api-testbed.scrive.com/api/v2/documents/${id}/update`;
  console.log(data);
  const config = {
    headers: {
      'Authorization': apiKey,
      'Content-Type': `multipart/form-data;boundary=${data._boundary}`
    }
  };
  try{
    const response = await axios.post(url, data, config)
    res.send(response.data);
  } catch(error){
    res.send(error);
  }
});



if (process.env.NODE_ENV === 'production') {
  // Serve any static files
  app.use(express.static(path.join(__dirname, 'client/build')));

  // Handle React routing, return all requests to React app
  app.get('*', function(req, res) {
    res.sendFile(path.join(__dirname, 'client/build', 'index.html'));
  });
}

app.listen(port, () => console.log(`Listening on port ${port}`));