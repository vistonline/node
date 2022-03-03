
const express = require('express');
const app = express();
const http = require('http').Server(app);
const cors = require('cors');
const multer = require('multer');
const db =require('./db.js');

const consign = require('consign');
const bodyParser = require('body-parser');
var upload = multer();


app.use(cors())
app.use(express.json());
app.use(bodyParser.json());
app.use(bodyParser.raw());
app.use(bodyParser.urlencoded({extended:false}));
app.use(upload.array());
app.db = db;
// app.set('view engine', 'ejs');
// app.use(express.static('./src/public'));

// cron.schedule('* * * * *', async () => {
//     console.log('running a task every minute');

//     var result = await app.db('backup_fotos')
//         .select()
//         .limit(4)
//         .where(function() {
//             this.where('status', 'error').andWhere('tentativas', '<', 11)
//             })
//         .orWhere({status: 'pendente'})
//         .orderBy([{ column: 'tentativas', order: 'desc' }, { column: 'data', order: 'desc' }]);

//     result.map( data => {
//         console.log(result)
//     } )
// });



// db('backup_fotos')
//     .select()
//     .limit(4)
//     .where(function() {
//         this.where('status', 'error').andWhere('tentativas', '<', 5)
//         })
//     .orWhere({status: 'pendente'})
//     .orderBy([{ column: 'tentativas', order: 'desc' }, { column: 'data', order: 'desc' }])
//     .then( result => {
//         result.map( data => {
//             console.log(data.backup_fotos_id)


//             axios.get(`http://8f7b-2804-14c-e1-a5db-a5f3-9917-7385-35b3.ngrok.io/sistema/`)
//                 .then( s => {
//                     console.log(s)
//                     db('backup_fotos')
//                         .where({ backup_fotos_id : data.backup_fotos_id })
//                         .update({ status: 'completo', status_body: s }) 
//                         .catch( e => console.log(e.message) )
//                 })
//                 .catch( e => {
//                     console.log(e.message)
//                     db('backup_fotos')
//                         .where({ backup_fotos_id : data.backup_fotos_id })
//                         .update({ status: 'error', status_body: e.message, tentativas: (data.tentativas+1) }) 
//                         .catch( e => console.log(e.message) )
//                 })


//         } )
//     });



consign()
    .include('./src/controllers')
    .then('./src/routes.js')
    .into(app);








module.exports = http;
