const express = require('express')
const router = express.Router();
const authcontroll = require('../controller/auth');

router.post('/login', authcontroll.userLogin);
router.post('/loginVerify', authcontroll.loginVerify);
router.post('/forgotPassword', authcontroll.forgotPassword);
router.post('/resetPasswordVerify', authcontroll.resetPasswordVerify);
router.post('/resetPassword', authcontroll.resetPassword);
