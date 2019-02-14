'use-strict';

//ROTAS DE USUARIO

//configuracao da rota
const router = require('./route-config')
const controller = require('../controller/user-controller');

// Rota post utilizando o corpo que esta na classe controller, metodo insertByObject
router.post('/insert/:data', controller.insertByObject);
router.get('/get/:data', controller.getLogin)
router.get('/getByName/:data', controller.getByName)
router.get('/getSentStock/:data', controller.getSentStock)
router.get('/getSentRequest/:data', controller.getSentRequest)


module.exports = router;