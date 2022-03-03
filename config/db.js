config = {

    client: 'mysql',
    connection: {
        host : process.env.DB_HOST || 'localhost',
        user : process.env.DB_USER || 'root',
        password : process.env.DB_PASS || 'datascan',
        database : 'webvist'
    },
    pool: {
      min: 2,
      max: 10
    },
    // migrations: {
    //   tableName: 'knex_migrations'
    // }
}

const knex = require('knex')(config);
// knex.migrate.latest([config]);
module.exports = knex;