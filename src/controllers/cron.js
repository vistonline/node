const axios = require('axios');
const cron = require('node-cron');
const fs = require('fs');
const S3 = require('aws-sdk/clients/s3');
const AWS = require('aws-sdk');
const { Storage } = require('@google-cloud/storage');
const moment = require('moment');
require('dotenv').config();


module.exports = app => {

    // console.log(process.env.GOOGLE_FILE_JSON)
    // console.log(moment(moment()).add(2, 'minutes'))

    cron.schedule('* * * * *', async () => {
        // process.env.TZ = "America/Sao_Paulo";
        //moment('2022-02-23 13:10:10','YYYY-MM-DD').add(11, 'minutes');
        // console.log(
        //     moment(moment()).add(2, 'minutes'),
        //     // moment().toString(),
        //     // new Date().toString()
        // );  

        console.log('running a task every minute');

        // var result = await app.db('backup_fotos')
        //     .select()
        //     .limit(4)
        //     .where(function() {
        //         this.where('status', 'error').andWhere('tentativas', '<', 11)
        //         })
        //     .orWhere({status: 'pendente'})
        //     .orderBy([{ column: 'tentativas', order: 'desc' }, { column: 'data', order: 'desc' }]);

        // result.map( data => {
        //     console.log(result)
        // } )
        app.db('backup_fotos')
        .select()
        .limit(300)
        .where(function() {
            this.where('status', 'error').andWhere('tentativas', '<', 100).andWhere('prox_tentativa', '<', moment().toDate() )
        })
        .orWhere({status: 'pendente'})
        .orderBy([{ column: 'tentativas', order: 'desc' }, { column: 'data', order: 'desc' }])
        .then( result => {
    
            result.map( data => {
    
                var data_foto_day = moment(data.data,'YYYY-MM-DD').format('DD');
                var data_foto_month = moment(data.data,'YYYY-MM-DD').format('MM');
                var data_foto_year = moment(data.data,'YYYY-MM-DD').format('YYYY');
    
                let key_path_file = `rot_${data.roterizador}/${data.seguradora}/${data_foto_year}/${data_foto_month}/${data_foto_day}/${data.solicitacao_id}/${data.file_name}`;
                let path_file = `../PHOTOS/${key_path_file}`;

                let tentativas = (data.tentativas+1)
                let prox_tentativa = moment(moment()).add((tentativas * tentativas), 'minutes').toDate()
                
                //Verificando arquivo e registrando tentativas caso nao exista
                if (!fs.existsSync(path_file)) {
                    console.log('File does not exists', path_file)

                    app.db('backup_fotos')
                        .where({ backup_fotos_id : data.backup_fotos_id })
                        .update({ 
                            status: 'error', status_body: "File does not exists", 
                            tentativas, prox_tentativa 
                        }) 
                        .catch( e => console.log(e.message) )
                    
                    return false
                }
    
                if(data.gateway=='wasabi') {
                    try {
                        const wasabiEndpoint = new AWS.Endpoint(process.env.WASABI_URL);
                        const s3 = new S3({
                            endpoint: wasabiEndpoint,
                            region: process.env.WASABI_REGION,
                            accessKeyId: process.env.WASABI_ACCESS_KEY,
                            secretAccessKey: process.env.WASABI_SECRET_KEY
                        });
                        
                        s3.putObject({
                            Body: fs.readFileSync(path_file),
                            Bucket: process.env.WASABI_BUCKET,
                            ACL: "public-read",
                            Key: key_path_file
                        } , (err, success) => {
                            if (err) {
                                console.log(err.message);

                                app.db('backup_fotos')
                                .where({ backup_fotos_id : data.backup_fotos_id })
                                .update({ 
                                    status: 'error', status_body: error.message, 
                                    tentativas, prox_tentativa 
                                }) 
                                .catch( e => console.log(e.message) )

                                return false;
                            }
                
                            console.log(success)
                            app.db('backup_fotos')
                            .where({ backup_fotos_id : data.backup_fotos_id })
                            .update({ status: 'completo', status_body: JSON.stringify(success) }) 
                            .catch( e => console.log(e.message) )
                        });
                    } catch (error) {
                        console.log(error.message)

                        app.db('backup_fotos')
                        .where({ backup_fotos_id : data.backup_fotos_id })
                        .update({ 
                            status: 'error', status_body: error.message, 
                            tentativas, prox_tentativa 
                        }) 
                        .catch( e => console.log(e.message) )
                    }
                } else if(data.gateway=='google') {

                    // Creates a client from a Google service account key
                    // const storage = new Storage({keyFilename: 'token.json'});
                    const storage = new Storage({keyFilename: process.env.GOOGLE_FILE_JSON});

                    // The ID of your GCS bucket
                    // const bucketName = 'jorgeteste';
                    const bucketName = process.env.GOOGLE_BUCKET;

                    // The path to your file to upload
                    const filePath = path_file;

                    // The new ID for your GCS file
                    const destFileName = key_path_file;


                    // async function uploadFile() {
                        storage.bucket(bucketName).upload(path_file, {
                            destination: key_path_file,
                            public: true,
                        })
                        .then(success => {
                            console.log(success)
                            app.db('backup_fotos')
                            .where({ backup_fotos_id : data.backup_fotos_id })
                            .update({ status: 'completo', status_body: JSON.stringify(success) }) 
                            .catch( e => console.log(e.message) )
                        })
                        .catch( error => {
                            console.error(error)
                        });

                    //   }

                    //   uploadFile().catch(console.error);
                }
            });
        });
    }, {
        timezone: "America/Sao_Paulo"
    });


   


}