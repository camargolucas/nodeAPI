'use-strict';
// instancia sql server
const sql = require('mssql');


// String de Conexão
const sqlConfig = {

    user: 'thothcompany',
    password: 'ImohtepHotep1971',
    server: 'mssql.thothcompany.com.br',
    database: 'thothcompany'
}

// Funçao para executar querys no sqlServer
module.exports.execSqlQuery = function (query, res) {
    return new Promise(function(resolve){

        new sql.ConnectionPool(sqlConfig).connect().then(pool => {
            return pool.request().query(query)
        }).then(result => {
           
            res.json((result.recordset))
            sql.close();
            resolve(result.recordset)
        })
        
    })
}
