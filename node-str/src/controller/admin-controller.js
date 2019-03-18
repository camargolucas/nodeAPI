'use-strict';

const sql = require('../db/sqlconfig');
const TABLE_ECONOMIC_GROUP_CLIENT_LIST = "GRUPO_ECONOMICO_CLIENTE";


exports.getEconomicGroupList = function(req, res) {
    let query ="SELECT idGrupoEconomicoCliente, nomeGrupoEconomicoCliente, idCategoriaCliente FROM " + TABLE_ECONOMIC_GROUP_CLIENT_LIST;
    sql.execSqlQueryClientReturn(query, res);
}