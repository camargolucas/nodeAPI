'use-strict';

const sql = require('../db/sqlconfig');
const TABLE_ECONOMIC_GROUP_CLIENT_LIST = "GRUPO_ECONOMICO_CLIENTE";
const TABLE_CLIENT_LIST = "CLIENTE_FORNECEDOR";

exports.getEconomicGroupList = function(req, res) {
    let query ="SELECT idGrupoEconomicoCliente, nomeGrupoEconomicoCliente, idCategoriaCliente FROM " + TABLE_ECONOMIC_GROUP_CLIENT_LIST;
    sql.execSqlQueryClientReturn(query, res);
}
exports.getClientList = function(req, res) {
    let query ="SELECT * FROM " + TABLE_CLIENT_LIST + " ORDER BY CODIGO ASC";
    sql.execSqlQueryClientReturn(query, res);
}

exports.createNewManagerAccount = function(req, res) {

    let userData = JSON.parse(req.params.data);

    let nomeUsuario = userData.nomeUsuario;
    let email = userData.email;
    let loja = userData.loja;
    let apelidoUsuario = userData.apelidoUsuario;
    let idUsuario = userData.idUsuario

    let senha = "12345";
    let idCargo = 2;
    let ativo = 1;
    let envioDiario = 1;

    let query = 
    "INSERT INTO (nomeUsuario, email, senha, loja, idCargo, ativo, apelidoUsuario, envioDiario)" +
    " VALUES ("+nomeUsuario+", "+email+", "+senha+", "+loja+", "+idCargo+", "+ativo+", "+email+", "+envioDiario+")";

    sql.execSqlQuery(query, res).then(() => {
      res.json(util.jsonStatusReturn['success'])
    })
}