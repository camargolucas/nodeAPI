'use-strict';


const router = require('./route-config')
const controller = require('../controller/admin-controller');

router.get('/search/name/:name', controller.getByName);
module.exports = router;