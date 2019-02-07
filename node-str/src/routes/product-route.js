'use-strict';

//ROTAS DE PRODUTOS

const router = require('./route-config')
const controller = require('../controller/product-controller');


router.put('/:id', controller.put);
router.delete('/', controller.delete);
router.get('/search/name/:name', controller.getByName);
router.get('/search/cod/:id', controller.getById);
router.post('/insertEstoque/:data', controller.insertEstoque)
router.post('/insertPedido/:data', controller.insertPedido)
router.get('/getAll', controller.getAll);
module.exports = router;