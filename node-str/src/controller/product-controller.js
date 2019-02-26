'use-strict';

const sql = require('../db/sqlconfig');
const formatDate = require('yyyy-mm-dd');
const userController = require('../controller/user-controller');

// ####################################################
// ## Método que busca produto pelo nome ##############
exports.getByName = function (req, res) {

    // Resgatado os parametros que foram passados pela URL 
    let name = req.params.name;

    // Variavel que recebe a consulta SQL
    let query = "SELECT IDPRODUTO,NOMEPROD AS NAME, RTRIM(TIPO) AS TIPO FROM PRODUTO WHERE NOMEPROD LIKE'" + name + "%'"
    sql.execSqlQueryClientReturn(query, res)

};

// ####################################################
// ## Método que busca produto pelo ID do produto #####
exports.getById = function (req, res) {

    // Resgatado os parametros que foram passados pela URL 
    let id = req.params.id;

    // Variavel que recebe a consulta SQL
    let query = "SELECT IDPRODUTO,NOMEPROD AS NAME, RTRIM(TIPO) AS TIPO FROM PRODUTO WHERE IDPRODUTO = " + id + ""

    // Execução da consulta
    sql.execSqlQueryClientReturn(query, res)

};

// ##########################################################
// ## Função utilizada para inserir o Estoque enviado #######
exports.insertEstoque = function (req, res) {

    // Resgatando o objeto passado via URL
    let dataRet = JSON.parse(req.params.data);

    // Desmebramento do objeto
    let dataEnvio = dataRet.dataEnvio;
    let tokenUsuario = dataRet.tokenUsuario;
    //Verifica se o Token enviado pelo usuário é Válido
    if( userController.checkJWTokenIsValid( tokenUsuario )  == true ){

        //Obtendo o Id do usuário pelo Token enviado, isso somente após verificar se o Token é Válido
        let idUsuario = userController.getIdUserWithToken(tokenUsuario);

        // Formatando a data para inserção no SQL : yyyy/MM/dd
        let date = new Date();
        date = formatDate(new Date(date.toISOString(dataEnvio)))

        // Insiro o estoque na tabela PRE_ESTOQUE e resgato o identity 
        let queryInsertEst = "INSERT INTO PRE_ESTOQUE (idUsuario, dataEstoque) VALUES (" + idUsuario + ",'" + date + "'); SELECT SCOPE_IDENTITY() AS id; "

        // Executo a consulta e pego o retorno do identity
        sql.execSqlQuery(queryInsertEst, res)
            .then((retorno) => {

                // Identity de retorno 
                let idEstoque = retorno[0]['id'];

                // Percorro o objeto onde está os dados do Produto que foi enviado por parametro
                // e Insiro N registros 
                dataRet.arrProduto.forEach(element => {

                    // Desmembro o objeto e distribuo em variáveis
                    let qtd = (element.produto.qtd)
                    let und = (element.produto.unidade)
                    let idProduto = (element.produto.nome.IDPRODUTO)

                    // Insiro os dados na PRE_ESTOQUE_DETALHADO
                    queryInsertDetalhado = "INSERT INTO PRE_ESTOQUE_DETALHADO (idEstoque, idProduto, quantidade, unidade) VALUES (" + idEstoque + "," + idProduto + "," + qtd + ",'" + und + "') "

                    sql.execSqlQuery(queryInsertDetalhado, res)
                });
            })
            .catch((err) => {
                console.log(err)
            })

    }
};

// ##########################################################
// ## Função utilizada para inserir o Pedido enviado #######
exports.insertPedido = function (req, res) {

    // Resgatando o objeto passado via URL
    let dataRet = JSON.parse(req.params.data);

    // Desmebramento do objeto
    let dataEnvio = dataRet.dataEnvio;
    let tokenUsuario = dataRet.tokenUsuario;

    //Verifica se o Token enviado pelo usuário é Válido
    if( userController.checkJWTokenIsValid(tokenUsuario)  == true ){
        //Obtendo o Id do usuário pelo Token enviado, isso somente após verificar se o Token é Válido
        let idUsuario = userController.getIdUserWithToken(tokenUsuario);
    
        // Formatando a data para inserção no SQL : yyyy/MM/dd
        let date = new Date();
        date = formatDate(new Date(date.toISOString(dataEnvio)))

        // Insiro o estoque na tabela PRE_ESTOQUE e resgato o identity 
        let queryInsertEst = "INSERT INTO PRE_PEDIDO (idUsuario, dataPedido) VALUES (" + idUsuario + ",'" + date + "'); SELECT SCOPE_IDENTITY() AS id; "

        // Executo a consulta e pego o retorno do identity
        sql.execSqlQuery(queryInsertEst, res)
            .then((retorno) => {

                // Identity de retorno 
                let idPedido = retorno[0]['id'];

                // Percorro o objeto onde está os dados do Produto que foi enviado por parametro
                // e Insiro N registros 
                dataRet.arrProduto.forEach(element => {

                    // Desmembro o objeto e distribuo em variáveis
                    let qtd = (element.produto.qtd)
                    let und = (element.produto.unidade)
                    let idProduto = (element.produto.nome.IDPRODUTO)

                    // Insiro os dados na PRE_ESTOQUE_DETALHADO
                    queryInsertDetalhado = "INSERT INTO PRE_PEDIDO_DETALHADO (idPedido, idProduto, quantidade, unidade) VALUES (" + idPedido + "," + idProduto + "," + qtd + ",'" + und + "') "
                    sql.execSqlQuery(queryInsertDetalhado, res)
                });
            })
            .catch((err) => {
                console.log(err)
            })
    }
}

// ###########################################################
// ## Função utilizada para resgatar todos os Produtos #######
module.exports.getAll = function (req, res) {

    let query = "SELECT IDPRODUTO,NOMEPROD AS NAME, RTRIM(TIPO) AS TIPO FROM PRODUTO"
    sql.execSqlQueryClientReturn(query, res)

}