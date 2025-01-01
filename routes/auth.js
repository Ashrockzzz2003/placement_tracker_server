const express = require('express')
const router = express.Router();
const authcontroll = require('../controller/auth');

router.get('/test', authcontroll.test);

router.post('/studentRegister', authcontroll.studentRegister);
router.post('/studentLoginVerify', authcontroll.studentVerify);

router.post('/login', authcontroll.userLogin);
router.post('/loginVerify', authcontroll.loginVerify);
router.post('/forgotPassword', authcontroll.forgotPassword);
router.post('/resetPasswordVerify', authcontroll.resetPasswordVerify);
router.post('/resetPassword', authcontroll.resetPassword);

module.exports = router