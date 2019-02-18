'use strict';
const express = require('express');
const Cors = require("cors");
const app = express();
const router = express.Router();
const bodyParser = require('body-parser');

// Indico que vai ser usado CORS nas rotas 
app.use(Cors());

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extend: false
}));

// instancia das rotas que serão utilizadas pelo app
const indexRoute = require('./routes/index-route');
const productRoute = require('./routes/product-route');
const userRoute = require('./routes/user-route');

// "/products" - Cabeça da rota, onde diferencio cada rota.
// Obs: Toda vez que for criar um novo tipo de pesquisa / utilização da API, voce deve criar
// uma nova rota para esse novo tipo que foi criado .
// ",productRoute" - Endereço da rota dentro do tipo selecionado 
// exemplo: (/products, productRoute) = "/products/PesquisaPorNome" .. "/products/PesquisaPorId"  
app.use('/', indexRoute);
app.use('/products', productRoute);
app.use('/users', userRoute); 


module.exports = app;
