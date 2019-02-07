'use-strict';

const sql = require('../db/sqlconfig')
const formatDate = require('yyyy-mm-dd');

exports.post = (req, res, next) => {
    res.status(201).send(req.body);
};


exports.delete = (req, res, next) => {
    res.status(200).send(req.body);
}

exports.put = (req, res, next) => {
    let id = req.params.id;
    res.status(201).send({
        id: id,
        item: req.body
    })
}


exports.getByName = function (req, res) {
    let name = req.params.name;
    let query = "SELECT IDPRODUTO,NOMEPROD AS NAME, RTRIM(TIPO) AS TIPO FROM PRODUTO WHERE NOMEPROD LIKE'" + name + "%'"
    sql.execSqlQuery(query, res)

};

exports.getById = function (req, res) {
    let id = req.params.id;
    let query = "SELECT IDPRODUTO,NOMEPROD AS NAME, RTRIM(TIPO) AS TIPO FROM PRODUTO WHERE IDPRODUTO = " + id + ""
    sql.execSqlQuery(query, res)

};


//exports.insertEstoque = function (req, res){
/*   let data = req.params.data;
  let idUser = data.idUsuario
  let date = data.dataEnvio
   */
//console.log('req.params.data')


//sql.execSqlQuery(query, res)
//}

exports.insertEstoque = function (req, res) {

    let dataRet = JSON.parse(req.params.data);
    let idUsuario = dataRet.idUsuario;
    let dataEnvio = dataRet.dataEnvio;
    let date = new Date();
    date = formatDate(new Date(date.toISOString(dataEnvio)))


    let queryInsertEst = "INSERT INTO PRE_ESTOQUE (IDUSUARIO, DATAESTOQUE) VALUES ('" + idUsuario + "','" + date + "'); SELECT SCOPE_IDENTITY() AS id; "
    sql.execSqlQuery(queryInsertEst, res)   
    .then((retorno)=>{        
        let idEstoque = retorno[0]['id'];        
        dataRet.arrProduto.forEach(element => {
            let qtd = (element.produto.qtd)
            let und = (element.produto.unidade)
            let idProduto = (element.produto.nome.IDPRODUTO)
                            
            queryInsertDetalhado = "INSERT INTO PRE_ESTOQUE_DETALHADO (idEstoque, idProduto, quantidade, unidade) VALUES ('" + idEstoque + "','" + idProduto + "', '" + qtd + "', '" + und + "') "
            sql.execSqlQuery(queryInsertDetalhado, res)            
        });
    })
    .catch((err)=>{
        console.log(err)
    })           
    
};
exports.insertPedido = function(req, res){

    let dataRet = JSON.parse(req.params.data);


    let idUsuario = dataRet.idUsuario;
    let dataEnvio = dataRet.dataEnvio;
    let date = new Date();
    date = formatDate(new Date(date.toISOString(dataEnvio)))


    let queryInsertEst = "INSERT INTO PRE_PEDIDO (IDUSUARIO, DATAPEDIDO) VALUES ('" + idUsuario + "','" + date + "'); SELECT SCOPE_IDENTITY() AS id; "
    sql.execSqlQuery(queryInsertEst, res)   
    .then((retorno)=>{        
        let idPedido = retorno[0]['id'];        
        dataRet.arrProduto.forEach(element => {
            let qtd = (element.produto.qtd)
            let und = (element.produto.unidade)
            let idProduto = (element.produto.nome.IDPRODUTO)
                            
            queryInsertDetalhado = "INSERT INTO PRE_PEDIDO_DETALHADO (idPedido, idProduto, quantidade, unidade) VALUES ('" + idPedido + "','" + idProduto + "', '" + qtd + "', '" + und + "') "
            sql.execSqlQuery(queryInsertDetalhado, res)            
        });
    })
    .catch((err)=>{
        console.log(err)
    })      

}

module.exports.getAll = function(req, res){
    
    let query = "SELECT IDPRODUTO,NOMEPROD AS NAME, RTRIM(TIPO) AS TIPO FROM PRODUTO"
    sql.execSqlQuery(query, res)
    .then((sql)=>{
       
    })
}