'use-strict';
// instancia da classe de configuracao sql 
const sql = require('../db/sqlconfig');

//========================================================================================================
// CRUD
//========================================================================================================

// Listar os usuários
exports.getUsers = function (req, res) {
    const selectUserSQL = "SELECT nomeUsuario, email, senha, loja, ativo, apelidoUsuario FROM PRE_USUARIO;";
    sql.execSqlQuery(selectUserSQL, res);
};

// Inserir novo usuário
exports.postUsers = function (req, res) {
    let users          = JSON.parse(req.params.data);    
    let nomeUsuario    = users.nomeUsuario;
    let email          = users.email;
    let senha          = users.senha;
    let loja           = users.loja;
    let apelidoUsuario = users.apelidoUsuario;

    const checkUserSQL = "SELECT COUNT(email) email, COUNT(apelidoUsuario) apelido FROM PRE_USUARIO WHERE email = '" + email + "' or apelidoUsuario ='" + apelidoUsuario + "'" + ";";
    sql.execSqlQuery(checkUserSQL, res)
    .then((value)=>{        
        let returnCheckEmail = value[0]['email'];
        let returnCheckLogin = value[0]['apelido'];
        
        if (returnCheckEmail == 0 && returnCheckLogin == 0) {
            console.log('Usuário não registrado');
            const query = "INSERT INTO PRE_USUARIO (nomeUsuario, email, senha, loja, apelidoUsuario) VALUES (' " + nomeUsuario + "', '" + email + "', '" + senha + "','" + loja + "', '" + apelidoUsuario + "') "
            sql.execSqlQuery(query, res);
        } else {
            console.log('Usuário já registrado');
        }
    })
};

// Editar os dados do usuário
exports.putUsers = function (req, res, next) {
    let users          = JSON.parse(req.params.data);
    let id             = req.params.id;
    let nomeUsuario    = users.nomeUsuario;
    let email          = users.email;
    let senha          = users.senha;
    let loja           = users.loja;
    let apelidoUsuario = users.apelidoUsuario;
    let idCargo        = users.idCargo;
    let ativo          = users.ativo;

    const updateUserSQL = 'UPDATE PRE_USUARIO SET nomeUsuario = ' + nomeUsuario + ', email = ' + email + ', senha = ' + senha + ', loja = ' + loja + ', apelidoUsuario = ' + apelidoUsuario + ' idCargo = ' + idCargo + ', ativo = ' + ativo + ',  WHERE idUsuario = ' + id + ';';
    sql.execSqlQuery(updateUserSQL, res);
};

// Excluir usuário
exports.deleteUsers = function (req, res, next) {
    let id              = req.params.id;
    const updateUserSQL = 'DELETE FROM PRE_USUARIO WHERE idUsuario = ' + id + ';';
    sql.execSqlQuery(updateUserSQL, res);
};
//========================================================================================================