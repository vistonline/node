/**
 * Iniciando a aplicação
 */

//  process.env.TZ = "America/Sao_Paulo";
//  console.log(new Date().toString());
const http = require('./config/server');

   

http.listen(process.env.PORT || 4000, () => {
    console.log('Running...');
})


  