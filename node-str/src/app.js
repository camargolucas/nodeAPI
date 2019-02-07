'use strict';
const express = require('express');
const Cors = require("cors");
const app = express();
const router = express.Router();
const bodyParser = require('body-parser');

app.use(Cors());

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extend: false
}));

// instancia das rotas que serão utilizadas pelo app
const indexRoute = require('./routes/index-route');
const productRoute = require('./routes/product-route');
const userRoute = require('./routes/user-route');


app.use('/', indexRoute);
app.use('/products', productRoute);
app.use('/users', userRoute);


module.exports = app;
