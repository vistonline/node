/**
 * Iniciando a aplicação
 */

//  process.env.TZ = "America/Sao_Paulo";
//  console.log(new Date().toString());
const http = require('./config/server');
const PORT = process.env.PORT || 4000;
   

http.listen(PORT, () => {
    console.log(`Server is listening on port ${PORT}`);
})


  