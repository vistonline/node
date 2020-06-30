
module.exports = app => {
    app.post('/ws/liberty', app.src.controllers.ws.liberty);

    
    app.get('/:id', (req, res) => {

        const hash = req.params.id;

    
        res.json({ hash });
    });

   


}