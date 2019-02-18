'use-strict';

const express = require('express');
const router = express.Router();


router.get('/', (req, res, next) => {
    res.status(201).send('API está rodando');
});


module.exports = router;