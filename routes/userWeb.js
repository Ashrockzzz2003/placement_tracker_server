const express = require('express')
const router = express.Router();
const userWebController = require('../controller/userWebController');

router.get('/test', userWebController.test);

router.post('/login', userWebController.userLogin);
router.post('/loginVerify', userWebController.loginVerify);

router.post('/studentLoginVerify', userWebController.studentVerify);
router.post('/studentRegister', userWebController.studentRegister);

router.post('/registerOfficial', userWebController.registerOfficial);
router.get('/getRegisteredOfficials', userWebController.getRegisteredOfficials);
router.post('/toggleOfficialStatus', userWebController.toggleOfficialAccountStatus);

router.post('/forgotPassword', userWebController.forgotPassword);
router.post('/resetPasswordVerify', userWebController.resetPasswordVerify);   //verify otp
router.post('/resetPassword', userWebController.resetPassword);   //reset password

router.post('/addCompany', userWebController.addCompany);
router.get('/getCompanies', userWebController.getCompanies);
router.post('/addPlacementData', userWebController.addPlacementData);

router.get('/getCompanyHireData',userWebController.getCompanyHireData);
router.get('/getCompanyHireData/:id',userWebController.getCompanyHireDataById);


module.exports = router;