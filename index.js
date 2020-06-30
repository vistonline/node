/**
 * Iniciando a aplicação
 */

const http = require('./config/server');

   

http.listen(process.env.PORT || 4000, () => {
    console.log('Running...');
})


  