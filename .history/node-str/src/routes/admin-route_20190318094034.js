'use-strict';

const router = require('./route-config')
const controller = require('../controller/admin-controller');

router.get('/economic-group-list/getAll', controller.getEconomicGroupList);
module.exports = router;