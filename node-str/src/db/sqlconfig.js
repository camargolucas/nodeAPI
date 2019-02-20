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

// Funçao para executar querys no sqlServer
module.exports.execSqlQuery = function (query, res) {
    return new Promise(function(resolve){

        new sql.ConnectionPool(sqlConfig).connect().then(pool => {
            return pool.request().query(query)            
        }).then(result => {
           
            // Retorno o resultado para a consulta para o cliente
            res.json((result.recordset))

            // fecho a conexão 
            sql.close();

            // Retorno o resultado da consulta para o servidor para ser utilizado dentro do servidor
            // para validações etc
            resolve(result.recordset)
        })
        
    })
}

// Funçao para executar querys no sqlServer
module.exports.execSqlQueryLogin = function (query, res) {

    return new Promise(function(resolve){
        new sql.ConnectionPool(sqlConfig).connect().then(pool => {
            return pool.request().query(query)
        }).then(result => {
            let token = userController.getNewTokenLoginWithJWT(result.recordset[0]['senha'], result.recordset[0]['senha'], result.recordset[0]['idUsuario'])
            var data = [
                { 
                    "idUsuario": result.recordset[0]['idUsuario'],
                    "nomeUsuario": result.recordset[0]['nomeUsuario'],
                    "senha": result.recordset[0]['senha'],
                    "loja": result.recordset[0]['loja'],
                    "idCargo": result.recordset[0]['idCargo'],
                    "ativo": result.recordset[0]['ativo'],
                    "apelidoUsuario": result.recordset[0]['apelidoUsuario'],
                    "token": token
                }
            ];

            res.json((data))
            sql.close();
            resolve(data)

        })
        
    })
}










