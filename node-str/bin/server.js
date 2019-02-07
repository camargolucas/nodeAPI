const Express = require("express");
const sql = require('mssql');
const app = require('../src/app.js');
const debug = require('debug')('nodestr:server');
const http = require('http');

// resgastando a porta
const port = normalizePort(process.env.PORT || '21093');

app.set('port',port);

// criando o server na porta indicada acima 
const server = http.createServer(app);
server.listen(port, ()=>{
    console.log(port);
})
server.on('listening',onListening);


/* app.use(function(request, response, next) {
    response.header("Access-Control-Allow-Origin", "*");
    response.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
}); */


function normalizePort(val){
    const port = parseInt(val,10);
    
    if(isNaN(port)){
        return val;
    }

    if(port >= 0){
      return port;
    }
    return false;
}

function onListening(){
    const addr = server.address();
    const bind = typeof addr === 'string'
    ? 'pipe ' + addr
    : 'port ' + addr.port;

    debug('listenng on' + bind);
}

