'use-strict';
//##################################################
//Importação da Classe Crypto necessária para 
//o sistema de geração de Tokens de acesso JWT
const crypto = require('crypto');

//##################################################
const formatDate = require('yyyy-mm-dd');

// instancia da classe de configuracao sql 
const sql = require('../db/sqlconfig');

// ## JSON utilizado validação de login
const statusLogin = {
    status: {
        '1': 'success',
        '2': 'invalid user',
        '3': 'invalid device'
    }
}

// #########################################################
// ## Serviço para inserir dados de cadastro o Usuário ####
/* exports.insertByObject = function (req, res) {
    // resgato o Objeto que foi enviado na URL 
    let users = JSON.parse(req.params.data);

    // Desmembramento do Objeto e distribuido em variaveis
    let nomeUsuario = users.nomeUsuario;
    let email = users.email;
    let senha = users.senha;
    let loja = users.loja;
    let apelidoUsuario = users.apelidoUsuario;

    // Verificação se ja existe usuario cadastrado 
    const checkUserSQL = "SELECT COUNT(email) email, COUNT(apelidoUsuario) apelido FROM PRE_USUARIO WHERE email = '" + email + "' or apelidoUsuario ='" + apelidoUsuario + "'" + ";";
    sql.execQueryClientReturn(checkUserSQL, res)
        .then((value) => {
            let returnCheckEmail = value[0]['email'];
            let returnCheckLogin = value[0]['apelido'];

            if (returnCheckEmail == 0 && returnCheckLogin == 0) {
                console.log('Usuário não registrado');
                const query = "INSERT INTO PRE_USUARIO (nomeUsuario, email, senha, loja, apelidoUsuario) VALUES (' " + nomeUsuario + "', '" + email + "', '" + senha + "','" + loja + "', '" + apelidoUsuario + "') "
                sql.execSqlQuery(query, res)
            } else {
                console.log('Usuário já registrado');
            }
        })
}; */


// ################################################
// ## Função que verifica o LOGIN do usuário ###### 
exports.getLogin = function (req, res) {
    let users = JSON.parse(req.params.data)
    let user = users.login
    let UUID = users.UUID
    let password = users.password
    let query = ""
    // let senha = users.senha;

    // Verifico se existe o caracter @ na string para saber se é um email 
    if (user.search('@') == -1) {
        query = "SELECT idUsuario, nomeUsuario, email, senha, loja, idCargo, ativo, apelidoUsuario FROM PRE_USUARIO WHERE apelidoUsuario = '" + user + "' AND SENHA = '" + password + "' "
    } else {
        query = "SELECT idUsuario, nomeUsuario, email, senha, loja, idCargo, ativo, apelidoUsuario FROM PRE_USUARIO WHERE EMAIL = '" + user + "' AND SENHA = '" + password + "' "
    }
    sql.execSqlQuery(query, res)
        .then((ret) => {
            if (ret == '') {

                // ## Caso usuário não esteja cadastrado...
                let jsonRet
                jsonRet = {
                    'userData': ret,
                    'status': statusLogin.status['2']
                }
                res.json(jsonRet)

            } else {

                // ## Se o usuário estiver cadastrado, crio um objeto com os dados do Usuário
                let token = getNewTokenLoginWithJWT(ret[0]['senha'], ret[0]['senha'], ret[0]['idUsuario'])
                var data = [{
                    "idUsuario": ret[0]['idUsuario'],
                    "nomeUsuario": ret[0]['nomeUsuario'],
                    "senha":ret[0]['senha'],
                    "loja": ret[0]['loja'],
                    "idCargo": ret[0]['idCargo'],
                    "ativo": ret[0]['ativo'],
                    "apelidoUsuario": ret[0]['apelidoUsuario'],
                    "token": token,
                    "logado": 1
                }];

                let idUser = ret[0]['idUsuario']
                // ## Verifico o dispositivo do Usuário
                verifyUserDevice(idUser, UUID, data, res)
            }
        })
};

// ## Função que verificar se há repetições de dispositivos
function verifyUserDevice(idUser, UUID, userDataResult, res) {
    let query = ""
    let jsonRet
    query = "SELECT UUID, idUsuario FROM PRE_LOGIN WHERE idUsuario = " + idUser + ""
    sql.execSqlQuery(query, res)
        .then((ret) => {

            // ## Se o retorno for vazio significa que o usuário não logou de nenhum dispositivo
            // ## então é inserido um novo UUID(id do Dispositivo) para ele na table PRE_LOGIN
            if (ret == '') {

                // ## Insiro na tabela o ID do dispositivo do usuário que está logando
                query = "INSERT INTO PRE_LOGIN(UUID, idUsuario) VALUES ('" + UUID + "', " + idUser + ")"
                sql.execSqlQuery(query, res)

                jsonRet = {
                    'userData': userDataResult,
                    'status': statusLogin.status['1']
                }
                res.json(jsonRet)

            } else {
                // ## Caso ele ja tenha acessado o sistema de algum dispositivo
                // ## verifico se o dispositivo em que ele está logando é o mesmo que ele utilizou
                // ## da ultima vez que acessou o sistema.
                if (ret[0]['UUID'] == UUID) {

                    jsonRet = {
                        'userData': userDataResult,
                        // ## status de autenticação bem sucedida
                        'status': statusLogin.status['1']
                    }
                    res.json(jsonRet)

                } else {

                    jsonRet = {
                        'userData': '',
                        // status de dispositivo inválido
                        'status': statusLogin.status['3']
                    }

                    // ## Se for dispositivo diferente, não possibilito o acesso dele
                    res.json(jsonRet)

                }
            }
        })

}

module.exports.getByName = function (res, req) {



}


//#############################################################
//#############################################################
//#############################################################
//GERAÇÃO DE TOKEN USANDO JWT ASSINADO COM HS256/SHA256
function getNewTokenLoginWithJWT  (email, password, idUser) {

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
        'id': idUser,
        'email': email,
        'password': password
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
    //Finalização da criação do TOKEN
    //Retorna o Token Gerado
    return base64Header + "." + base64Payload + "." + signatureUrl;
}
//#############################################################
//#############################################################
//#############################################################




//#############################################################
//#############################################################
//#############################################################
//Checa se a assinatura em HS256 é Válida, retorna TRUE 
//para um TOKEN válido e FALSE para um token inválido

module.exports.checkJWTokenIsValid = function (token) {


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
    let dataToken = base64Header + '.' + base64Payload;

    let signature = crypto
        .createHmac('sha256', secret)
        .update(dataToken)
        .digest('base64');

    const signatureUrl = signature
        .replace(/\+/g, '-')
        .replace(/\//g, '_')
        .replace(/=/g, '')


    let dataTokenAssinatura = base64Payload;
    let buff = new Buffer(dataTokenAssinatura, 'base64');
    let text = buff.toString('ascii');

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

//#############################################################
//Obtendo o ID do usuário atravez do TOKEN gerado e enviado pelo usuário

module.exports.getIdUserWithToken = function ( token ){

    //###############################################################
    //Usando Split para separar o cabeçalho, o corpo e a assinatura do Token
    let token_res = token.split(".");
    //Obtendo o valor do cabeçalho e corpo pelo vetor gerado pelo Split
    //let base64Header = token_res[0];
    let base64Payload = token_res[1];
    //let key = token_res[2];
    //###############################################################
    //###############################################################

    //Decodifica o corpo do Token recebido com base64 decode
    let data = base64Payload;
    let buff = new Buffer(data, 'base64');
    //let text = buff.toString('ascii');
    let dataUser = JSON.parse(buff.toString('ascii'));

    //retornamos o ID do usuário abstraido do TOKEN.
    console.log("ID_USER :" + dataUser['id']);
    return dataUser['id'];

}

// #################################################################################
// ## Função utilizada para verificar se foi enviado estoque pelo Usuário logado ###
exports.getSentStock = function (req, res) {
    let userData = JSON.parse(req.params.data);
    let idUsuario = userData['idUsuario'];
    let data = userData['data'];


    let dateNow = new Date()
    dateNow = formatDate(new Date(dateNow.toISOString(data)))


    let query = "SELECT COUNT(idEstoque) ENVIOS FROM PRE_ESTOQUE WHERE IDUSUARIO = " + idUsuario + " AND dataEstoque = '" + dateNow + "' "
    console.log(query)
    sql.execSqlQueryClientReturn(query, res)
};

// #################################################################################
// ## Função utilizada para verificar se foi enviado Pedido pelo Usuário logado ###
exports.getSentRequest = function (req, res) {
    let userData = JSON.parse(req.params.data);
    let idUsuario = userData['idUsuario'];
    let data = userData['data'];


    let dateNow = new Date()
    dateNow = formatDate(new Date(dateNow.toISOString(data)))


    let query = "SELECT COUNT(idPedido) ENVIOS FROM PRE_PEDIDO WHERE IDUSUARIO = " + idUsuario + " AND dataPedido = '" + dateNow + "' "
    sql.execSqlQueryClientReturn(query, res)

};