
module.exports = app => {
    app.post('/ws/liberty', app.src.controllers.ws.liberty);
    app.all('/send', app.src.controllers.services.send);
    app.get('/aws', app.src.controllers.aws.aws);
    app.get('/google', app.src.controllers.aws.google);


    
    app.get('/:id', (req, res) => {

        const hash = req.params.id;

    
        res.json({ hash });
    });

   


}