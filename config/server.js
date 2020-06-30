
const express = require('express');
const app = express();
const http = require('http').Server(app);
const cors = require('cors');
// const multer = require('multer');

const consign = require('consign');
const bodyParser = require('body-parser');
// var upload = multer();

app.use(express.json());
app.use(bodyParser.json()); // support json encoded bodies
app.use(bodyParser.urlencoded({ extended: true })); // support encoded bodies
// app.use(upload.array());
app.use(cors({
    origin: '*'
}))
// app.set('view engine', 'ejs');
// app.use(express.static('./src/public'));

consign()
    .include('./src/controllers')
    .then('./src/routes.js')
    .into(app);

module.exports = http;
