'use-strict';

const router = require('./route-config')
const controller = require('../controller/admin-controller');

router.get('/economic-group-list/getAll/:token', controller.getEconomicGroupList);
router.get('/client/getAll/:token', controller.getClientList);
router.get('/manager/getAll/:token', controller.getAllManagerList);
router.post('/user/create/manager/:data/:token', controller.createNewManagerAccount);
router.post('/user/create/:data/:token', controller.createNewUserAccount);
router.post('/user/block/:data/:token', controller.blockUser);
module.exports = router;