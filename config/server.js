
const express = require('express');
const app = express();
const http = require('http').Server(app);
const cors = require('cors');
const multer = require('multer');

const consign = require('consign');
const bodyParser = require('body-parser');
var upload = multer();

app.use(cors())
app.use(express.json());
app.use(bodyParser.json());
app.use(bodyParser.raw());
app.use(bodyParser.urlencoded({extended:false}));
app.use(upload.array());
// app.set('view engine', 'ejs');
// app.use(express.static('./src/public'));

consign()
    .include('./src/controllers')
    .then('./src/routes.js')
    .into(app);

module.exports = http;
