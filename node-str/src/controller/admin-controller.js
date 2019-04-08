'use-strict';

const sql = require('../db/sqlconfig');
const TABLE_ECONOMIC_GROUP_CLIENT_LIST = "GRUPO_ECONOMICO_CLIENTE";
const TABLE_CLIENT_LIST = "CLIENTE_FORNECEDOR";
const util = require('../../utils/utils');
const userController = require('../controller/user-controller');

exports.getEconomicGroupList = function(req, res) {

    if (userController.checkJWTokenIsValid(req.params.token) == true) {
        let idUser = userController.getIdUserWithToken(req.params.token);
        let query = "SELECT idCargo FROM PRE_USUARIO WHERE idUsuario = " + idUser + " AND ativo = 1";
        sql.execSqlQuery(query).then(ret => {
            if(ret[0].idCargo > 1){
                //########################################################
                //Consulta
                let query ="SELECT idGrupoEconomicoCliente, nomeGrupoEconomicoCliente, idCategoriaCliente FROM " + TABLE_ECONOMIC_GROUP_CLIENT_LIST;
                sql.execSqlQueryClientReturn(query, res);
                //########################################################
            }else{
                return null;
            }
        });
    }else{
        return null;
    }

}
exports.getClientList = function(req, res) {

    if (userController.checkJWTokenIsValid(req.params.token) == true) {
        let idUser = userController.getIdUserWithToken(req.params.token);
        let query = "SELECT idCargo FROM PRE_USUARIO WHERE idUsuario = " + idUser + " AND ativo = 1";
        sql.execSqlQuery(query).then(ret => {
            if(ret[0].idCargo > 1){
                //########################################################
                //Consulta
                let query ="SELECT * FROM " + TABLE_CLIENT_LIST + " ORDER BY CODIGO ASC";
                sql.execSqlQueryClientReturn(query, res);
                //########################################################
            }else{
                return null;
            }
        });
    }else{
        return null;
    }
}
exports.createNewManagerAccount = function(req, res) {
    if (userController.checkJWTokenIsValid(req.params.token) == true) {
        let idUser = userController.getIdUserWithToken(req.params.token);
        let query = "SELECT idCargo FROM PRE_USUARIO WHERE idUsuario = " + idUser + " AND ativo = 1";
        sql.execSqlQuery(query).then(ret => {
            if(ret[0].idCargo > 2){
                //########################################################
                //Consulta


                let userData = JSON.parse(req.params.data);

                let nomeUsuario = userData.email;
                let email = userData.email;
                let loja = userData.loja;
                let apelidoUsuario = userData.apelidoUsuario;
                let idUsuario = userData.idUsuario
            
                //A senha deverá ser gerada automaticamente pelo sistema
                let senha = util.generatePassword();
                let idCargo = 2;
                let ativo = 1;
                let envioDiario = 1;
            
                if(email != null && email!= undefined && email != ""){
            
                    let query = "INSERT INTO PRE_USUARIO (nomeUsuario, email, senha, grupoEconomico, idCargo, ativo, apelidoUsuario, envioDiario) VALUES ('"+nomeUsuario+"', '"+email+"', '"+senha+"', "+loja+", "+idCargo+", "+ativo+", '"+apelidoUsuario+"', "+envioDiario+")";
            
                    console.log("userData : " + senha);
            
                    sql.execSqlQuery(query, res).then(() => {
                        res.json(util.jsonStatusReturn['success'])
                    });
            
                }else{
                    return res.json(util.jsonStatusReturn['error']);
                }
                //########################################################
            }else{
                return null;
            }
        });
    }else{
        return null;
    }







}
exports.createNewUserAccount = function(req, res) {

    if (userController.checkJWTokenIsValid(req.params.token) == true) {
        let idUser = userController.getIdUserWithToken(req.params.token);
        let query = "SELECT idCargo FROM PRE_USUARIO WHERE idUsuario = " + idUser + " AND ativo = 1";
        sql.execSqlQuery(query).then(ret => {
            if(ret[0].idCargo > 1){
                //########################################################
                //Consulta
                let userData = JSON.parse(req.params.data);

                let nomeUsuario = userData.email;
                let email = userData.email;
                let loja = userData.loja;
                let apelidoUsuario = userData.apelidoUsuario;
                let idUsuario = userData.idUsuario
            
                //A senha deverá ser gerada automaticamente pelo sistema
                let senha = util.generatePassword();
                let idCargo = 1;
                let ativo = 1;
                let envioDiario = 1;
            
                if(email != null && email!= undefined && email != ""){
            
                    let query = "INSERT INTO PRE_USUARIO (nomeUsuario, email, senha, grupoEconomico, idCargo, ativo, apelidoUsuario, envioDiario) VALUES ('"+nomeUsuario+"', '"+email+"', '"+senha+"', "+loja+", "+idCargo+", "+ativo+", '"+apelidoUsuario+"', "+envioDiario+")";
            
                    sql.execSqlQuery(query, res).then(() => {
                        res.json(util.jsonStatusReturn['success'])
                    });
            
                }else{
                    return res.json(util.jsonStatusReturn['error']);
                }
                //########################################################
            }else{
                return null;
            }
        });
    }else{
        return null;
    }

}
exports.blockUser = function(req, res){

    if (userController.checkJWTokenIsValid(req.params.token) == true) {
        let idUser = userController.getIdUserWithToken(req.params.token);
        let query = "SELECT idCargo FROM PRE_USUARIO WHERE idUsuario = " + idUser + " AND ativo = 1";
        sql.execSqlQuery(query).then(ret => {
            if(ret[0].idCargo > 1){
                //########################################################
                //Consulta
                let userData = JSON.parse(req.params.data)
                let idUsuario = userData.idUsuario
                let ativo = userData.ativo;
                let query ="";
            
                if(ativo == "1"){
                    query = "UPDATE PRE_USUARIO SET ativo = 0 WHERE idUsuario = " + idUsuario;
                }else{
                    query = "UPDATE PRE_USUARIO SET ativo = 1 WHERE idUsuario = " + idUsuario;
                }
                sql.execSqlQuery(query, res)
                  .then(() => {
                    res.json(util.jsonStatusReturn['success'])
                  })
                //########################################################
            }else{
                return null;
            }
        });
    }else{
        return null;
    }



}
exports.getAllManagerList = function(req, res){

    if (userController.checkJWTokenIsValid(req.params.token) == true) {
        let idUser = userController.getIdUserWithToken(req.params.token);
        let query = "SELECT idCargo FROM PRE_USUARIO WHERE idUsuario = " + idUser + " AND ativo = 1";
        sql.execSqlQuery(query).then(ret => {
            if(ret[0].idCargo > 1){
                //########################################################
                //Consulta
                let query = "SELECT idUsuario, nomeUsuario, email, apelidoUsuario, grupoEconomico, idCargo, ativo FROM PRE_USUARIO WHERE idCargo = 2";
                sql.execSqlQueryClientReturn(query, res);
                //########################################################
            }else{
                return null;
            }
        });
    }else{
        return null;
    }



}
exports.getAllPrePedidoList = function(req, res){

    if (userController.checkJWTokenIsValid(req.params.token) == true) {
        let idUser = userController.getIdUserWithToken(req.params.token);
        let query = "SELECT idCargo FROM PRE_USUARIO WHERE idUsuario = " + idUser + " AND ativo = 1";
        sql.execSqlQuery(query).then(ret => {
            if(ret[0].idCargo > 1){
                //########################################################
                //Consulta
                let query = "SELECT idUsuario, nomeUsuario, email, apelidoUsuario, loja, idCargo, ativo FROM PRE_USUARIO WHERE idCargo = 2";
                sql.execSqlQueryClientReturn(query, res);
                //########################################################
            }else{
                return null;
            }
        });
    }else{
        return null;
    }



}

