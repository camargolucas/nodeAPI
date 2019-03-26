'use-strict';

const router = require('./route-config')
const controller = require('../controller/admin-controller');

router.get('/economic-group-list/getAll', controller.getEconomicGroupList);
router.get('/client/getAll', controller.getClientList);
router.get('/manager/getAll', controller.getClientList);
router.post('/user/create/manager/:data', controller.createNewManagerAccount);
router.post('/user/create/:data', controller.createNewUserAccount);
router.post('/user/block/:data', controller.blockUser);
module.exports = router;