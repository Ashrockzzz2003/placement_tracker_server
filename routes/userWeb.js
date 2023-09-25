const express = require('express')
const router = express.Router();
const userWebController = require('../controller/userWebController');

router.get('/test', userWebController.test);

router.post('/register', userWebController.userRegister);
router.post('/registerVerify', userWebController.userRegisterVerify);
router.post('/login', userWebController.userLogin);



module.exports = router;