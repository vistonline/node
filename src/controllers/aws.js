const axios = require('axios');
const fs = require('fs');
const S3 = require('aws-sdk/clients/s3');
const AWS = require('aws-sdk');
const {Storage} = require('@google-cloud/storage');
const wasabiEndpoint = new AWS.Endpoint('https://s3.us-east-1.wasabisys.com');


const accessKeyId = 'CW0UP5Z0HHO5OL2ITSRD9999999';
const secretAccessKey = 'gwQKzQsCzSmJZn3ZULZhM1zFVtMu3dyfAj2zzNfR999999';

module.exports =  app => {
    const aws = async (req, res) => {
        // console.log(req.method);
        // const fileContent = fs.readFileSync('a.pdf');
      
      
        try {
            const s3 = new S3({
              endpoint: wasabiEndpoint,
              region: 'us-east-1',
              accessKeyId,
              secretAccessKey
            });
          
            
            s3.putObject({
                Body: fs.readFileSync('b.png'),
                Bucket: "teste",
                ACL: "public-read",
                Key: 'a/imagem1111.png'
            } , (err, data) => {
                if (err) {
                    console.log('344444',err);
                    return false;
                }
    
                console.log(data)
            });
        } catch (error) {
            console.log('411111',error.message);
        }
       
          return res.status(200).send([]);
        
    }

    const google = async (req, res) => {
        // console.log(req.method);
        // const fileContent = fs.readFileSync('a.pdf');

        // Creates a client from a Google service account key
        const storage = new Storage({keyFilename: 'token.json'});

        // The ID of your GCS bucket
        const bucketName = 'jorgeteste';

        // The path to your file to upload
        const filePath = '/var/www/html/node/aws/b.png';

        // The new ID for your GCS file
        const destFileName = 'node/teste/b2.png';


        // async function uploadFile() {
            storage.bucket(bucketName).upload(filePath, {
              destination: destFileName,
              public: true,
            })
            .then(sucess => {

                console.log(`${filePath} uploaded to ${bucketName}`, sucess);
            })
            .catch( error => {
                console.error(error)
            });
        
        //   }
        
        //   uploadFile().catch(console.error);
      
      
        // const s3 = new S3({
        //   endpoint: wasabiEndpoint,
        //   region: 'us-east-1',
        //   accessKeyId,
        //   secretAccessKey
        // });
      
        // try {
            
        //     s3.putObject({
        //         Body: fs.readFileSync('b.png'),
        //         Bucket: "teste",
        //         ACL: "public-read",
        //         Key: 'a/imagem10.png'
        //     } , (err, data) => {
        //         if (err) {
        //             console.log(err);
        //             return false;
        //         }
    
        //         console.log(data)
        //     });
        // } catch (error) {
        //     console.log(error.message);
        // }
       
          return res.status(200).send([]);
        
    }
    // https://autoglass.aucmjv.com.br/vistoriav1/vistoria
    return { aws, google }
}