'use-strict';

//ROTAS DE USUARIO

//configuracao da rota
const router = require('./route-config')
const controller = require('../controller/userAdmin-controller');
//================================================================================
// *** Rotas para o CRUD - RESTFULL ***                                          |
//================================================================================
router.get('/get', controller.getUsers);                // Listar os usuários    |
router.post('/post/:data', controller.postUsers);       // Inserir novo usuário  |
router.put('/put/:id', controller.putUsers);            // Editar usuário        |
router.delete('/delete/:id', controller.deleteUsers);   // Excluir usuário       |
//================================================================================
module.exports = router;