'use-strict';
// instancia sql server
const sql = require('mssql');
const userController = require('../controller/user-controller')

// String de Conexão
const sqlConfig = {

    user: 'thothcompany',
    password: 'ImohtepHotep1971',
    server: 'mssql.thothcompany.com.br',
    database: 'thothcompany'
}

module.exports.execSqlQuery = function (query, res) {
    return new Promise(function (resolve) {

        new sql.ConnectionPool(sqlConfig).connect().then(pool => {
            return pool.request().query(query)
        }).then(result => {

            // Retorno o resultado da consulta para o servidor para ser utilizado dentro do servidor
            // para validações etc
            resolve(result.recordset)

            // fecho a conexão 
            sql.close();
        })

    })
}



// Funçao para executar querys no sqlServer
module.exports.execSqlQueryClientReturn = function (query, res) {
    return new Promise(function (resolve) {

        new sql.ConnectionPool(sqlConfig).connect().then(pool => {
            return pool.request().query(query)
        }).then(result => {

            // Retorno o resultado para a consulta para o cliente
            res.json((result.recordset))

            // fecho a conexão 
            sql.close();
        })

    })
}

