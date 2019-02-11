'use-strict';
//##################################################
//Importação da Classe Crypto necessária para 
//o sistema de geração de Tokens de acesso JWT
const crypto = require('crypto');

//##################################################
const formatDate = require('yyyy-mm-dd');

// instancia da classe de configuracao sql 
const sql = require('../db/sqlconfig');

// Serviço para inserir dados de cadastro o Usuário
exports.insertByObject = function (req, res) {
    let users = JSON.parse(req.params.data);

    let nomeUsuario = users.nomeUsuario;
    let email = users.email;
    let senha = users.senha;
    let loja = users.loja;
    let apelidoUsuario = users.apelidoUsuario;

    const query = "INSERT INTO PRE_USUARIO (nomeUsuario, email, senha, loja, apelidoUsuario) VALUES (' " + nomeUsuario + "', '" + email + "', '" + senha + "','" + loja + "', '" + apelidoUsuario + "') "
    sql.execSqlQuery(query, res)

};

exports.getLogin = function (req, res) {
    let users = JSON.parse(req.params.data)
    let user = users.login
    let password = users.password
    let query = ""
    // let senha = users.senha;



    getNewTokenLoginWithJWT(users.login, password, 1);

    // Verifico se existe o caracter @ na string para saber se é um email 
    if (user.search('@') == -1) {
        query = "SELECT idUsuario, nomeUsuario, email, senha, loja, idCargo, ativo, apelidoUsuario FROM PRE_USUARIO WHERE apelidoUsuario = '" + user + "' AND SENHA = '" + password + "' "
    } else {
        query = "SELECT idUsuario, nomeUsuario, email, senha, loja, idCargo, ativo, apelidoUsuario FROM PRE_USUARIO WHERE EMAIL = '" + user + "' AND SENHA = '" + password + "' "
    }
    sql.execSqlQuery(query, res)
};

module.exports.getByName = function (res, req) {



}


//#############################################################
//#############################################################
//#############################################################
//GERAÇÃO DE TOKEN USANDO JWT ASSINADO COM HS256/SHA256
function getNewTokenLoginWithJWT(email, senha, idUsuario) {

    //###############################################################
    //Definição do Cabeçalho com padrão de codificação do Token
    const header = JSON.stringify({
        'alg': 'HS256',
        'typ': 'JWT'
    });
    //###############################################################
    //###############################################################

    //###############################################################
    //Definição do corpo do Token
    const payload = JSON.stringify({
        'id': idUsuario,
        'email': email,
        'password': senha
    });
    //###############################################################
    //###############################################################

    //###############################################################
    //Conversão em base64 do cabeçalho e do corpo do Token
    const base64Header = Buffer.from(header).toString('base64').replace(/=/g, '');
    const base64Payload = Buffer.from(payload).toString('base64').replace(/=/g, '');
    //###############################################################
    //###############################################################

    //###############################################################
    //Definição da chave secreta de geração da assinatura
    const secret = 'thothcompanyAppKey87461';
    //###############################################################
    //###############################################################

    //###############################################################
    //Criação a Assinatura SHA256

    //Concatenação do cabeçalho e do corpo do Token
    const data = base64Header + '.' + base64Payload;
    const signature = crypto
        .createHmac('sha256', secret)
        .update(data)
        .digest('base64');

    const signatureUrl = signature
        .replace(/\+/g, '-')
        .replace(/\//g, '_')
        .replace(/=/g, '')
    //###############################################################

    console.log("token_gerado : " + base64Header + "." + base64Payload + "." + signatureUrl);
    //###############################################################
    //Finalização da criação do TOKEN
    //Retorna o Token Gerado
    getIdUserWithToken(base64Header + "." + base64Payload + "." + signatureUrl);

    return base64Header + "." + base64Payload + "." + signatureUrl;
    /*
    O Token gerado deve ser guardado em uma tabela para consulta posterir
    Estrutura da tabela de autenticação
     ___________________________________________________
    |                    user_login                     |
    |___________________________________________________|
    | id            int     11  autoincrement           |
    | idUsuario     int     11  autoincrement index     |
    | token         varchar 255 index                   |
    | timestamp     varchar 255                         |
    | status        int     11                          |
    |___________________________________________________|
    */

    //console.log("token_gerado : " + token_gerado);
    // console.log("TOKEN_VALIDO : " + ckeckJWTKeiIsValid(token_gerado));
}
//#############################################################
//#############################################################
//#############################################################




//#############################################################
//#############################################################
//#############################################################
//Checa se a assinatura em HS256 é Válida, retorna TRUE 
//para um TOKEN válido e FALSE para um token inválido
function ckeckJWTKeiIsValid(token) {

    //###############################################################
    //###############################################################
    //Definição da chave secreta de geração da assinatura do Token
    const secret = 'thothcompanyAppKey87461';
    //###############################################################
    //###############################################################

    //###############################################################
    //Usando Split para separar o cabeçalho, o corpo e a assinatura do Token
    let token_res = token.split(".");
    //Obtendo o valor do cabeçalho e corpo pelo vetor gerado pelo Split
    let base64Header = token_res[0];
    let base64Payload = token_res[1];
    let key = token_res[2];
    //###############################################################
    //###############################################################

    //Concatenação do cabeçalho e do corpo do Token
    const data = base64Header + '.' + base64Payload;

    const signature = crypto
        .createHmac('sha256', secret)
        .update(data)
        .digest('base64');

    const signatureUrl = signature
        .replace(/\+/g, '-')
        .replace(/\//g, '_')
        .replace(/=/g, '')


    let data = base64Payload;
    let buff = new Buffer(data, 'base64');
    let text = buff.toString('ascii');

    console.log(text);

    if (signatureUrl == key) {
        return true;
    } else {
        return false;
    }

    //#############################################################
    //##########################################################
    //Como usar
    /*
    if(ckeckJWTKeiIsValid(token) === true){
        console.log("TOKEN VÁLIDO");
    }else{
        console.log("TOKEN inVÁLIDO");
    }
    */
    //##########################################################
    //#############################################################
}
//#############################################################
//#############################################################
//#############################################################


function getIdUserWithToken(token) {


    let data = token;
    let buff = new Buffer(data, 'base64');
    let text = buff.toString('ascii');

    console.log(text);

    /*
        Fazer a consulta atraves do Token de usuário para buscar o ID válido.
        Para qualquer consulta que necessite usar o ID do usuário, deve-se usar 
        O Id retornado por essa função.
    */


}

exports.getSentStock = function (req, res) {
    let userData = JSON.parse(req.params.data);
    let idUsuario = userData['idUsuario'];
    let data = userData['data'];


    let dateNow = new Date()
    dateNow = formatDate(new Date(dateNow.toISOString(data)))

    
    let query = "SELECT COUNT(idEstoque) ENVIOS FROM PRE_ESTOQUE WHERE IDUSUARIO = " + idUsuario + " AND dataEstoque = '" + dateNow + "' "
    
    sql.execSqlQuery(query, res)
    
};