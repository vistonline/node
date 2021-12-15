const axios = require('axios');

module.exports =  app => {
    const send = async (req, res) => {
        // console.log(req.method);

        if(!req.headers['url']){
            return res.status(400).send({
                "message": "Falta o parametro headers URL.",
                "status": "400"
            });
        }

        
        let config = {};
        if(req.headers['headers']) {
            config = {
                headers:  JSON.parse(req.headers['headers'])
            }
        }

        let param = null
        let response = null
        const url = req.headers['url'];

        if(req.body) {
            param = JSON.stringify(req.body)
        }

        try {
            
            switch (req.method) {
                case 'POST': response = await axios.post(url, param ,config); break;
                case 'PUT': response = await axios.put(url, param ,config); break;
                case 'DELETE': response = await axios.delete(url, param ,config); break;
                case 'GET': response = await axios.post(url, config); break;
            
                default:
                    return res.status(500).send({
                        "message": `Method invalid:${req.method}`,
                        "status": "500"
                    });
            }
            // console.log(response)

            return res.status(200).send(response.data);
        } catch (error) {
            let status = 417
            let message = ''
            if (error.response) {
                // Request made and server responded
                // console.log(error.response.data);
                // console.log(error.response.status);
                // console.log(error.response.headers);
                status = error.response.status
                message = error.response.data
                return res.status(error.response.status).send(error.response.data);
            } else {
                // Something happened in setting up the request that triggered an Error
                // console.log('Error', error.message);
                message = error.message
            }
            return res.status(status).send(message);
        }

        
    }
    // https://autoglass.aucmjv.com.br/vistoriav1/vistoria
    return { send }
}