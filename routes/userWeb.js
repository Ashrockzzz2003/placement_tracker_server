const express = require('express')
const router = express.Router();
const userWebController = require('../controller/userWebController');

router.get('/test', userWebController.test);

router.post('/login', userWebController.userLogin);
router.post('/studentLoginVerify', userWebController.studentVerify);
router.post('/studentRegister', userWebController.studentRegister);
router.post('/loginVerify', userWebController.loginVerify);
router.post('/registerOfficial', userWebController.registerOfficial);
router.get('/getRegisteredOfficials', userWebController.getRegisteredOfficials);
router.post('/toggleOfficialStatus', userWebController.toggleOfficialAccountStatus);



module.exports = router;