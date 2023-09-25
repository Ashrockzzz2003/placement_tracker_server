const express = require('express')
const router = express.Router();
const userWebController = require('../controller/userWebController');

router.get('/test', userWebController.test);

router.post('/login', userWebController.userLogin);
router.post('/registerOfficial', userWebController.registerOfficial);
router.get('/getRegisteredOfficials', userWebController.getRegisteredOfficials);



module.exports = router;