var soap = require('soap'); 

module.exports =  app => {
    const liberty = async (req, res) => {

        var url = req.headers.soapurl;
        var action = req.headers.soapaction;

        if(!req.body) {
            return res.status(400).send({
                "message": "Nenhum parametro passado.",
                "status": "400"
            });
        }

        const args = JSON.parse(JSON.stringify(req.body));

        await soap.createClient(url, async (err, client) => {

            if(err) return res.status(400).send(err.message);
            
            try {
                if (client[action]) {
                    await client[action](args, async (err, result) => {

                        if(err) return res.status(400).send(err.message);
    
                        return res.json( result );
                    });
                } else {
                    return res.status(400).send({
                        "message": "Ação solicitada não existe",
                        "status": "400"
                    });
                }
            } catch (error) {
                console.log(error)
                return res.status(500).send(error);
            }
        });
    }

    return { liberty }
}