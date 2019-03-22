'use-strict';

const router = require('./route-config')
const controller = require('../controller/admin-controller');

router.get('/economic-group-list/getAll', controller.getEconomicGroupList);
router.get('/client/getAll', controller.getClientList);
router.post('/user/create/manager/:data', controller.createNewManagerAccount);
module.exports = router;