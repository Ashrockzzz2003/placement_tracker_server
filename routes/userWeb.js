const express = require('express')
const router = express.Router();
const userWebController = require('../controller/userWebController');

router.get('/test', userWebController.test);

router.post('/login', userWebController.userLogin);
router.post('/loginVerify', userWebController.loginVerify);

router.post('/studentLoginVerify', userWebController.studentVerify);
router.post('/studentRegister', userWebController.studentRegister);
router.post('/studentEditData', userWebController.studentEditData);
router.post('/getStudentPlacements', userWebController.getStudentPlacements);

router.post('/registerOfficial', userWebController.registerOfficial);
router.post('/addStudent', userWebController.addStudent);
router.get('/getRegisteredOfficials', userWebController.getRegisteredOfficials);
router.post('/toggleOfficialStatus', userWebController.toggleOfficialAccountStatus);

router.post('/forgotPassword', userWebController.forgotPassword);
router.post('/resetPasswordVerify', userWebController.resetPasswordVerify);
router.post('/resetPassword', userWebController.resetPassword);

router.post('/addCompany', userWebController.addCompany);
router.get('/getCompanies', userWebController.getCompanies);
router.post('/addPlacementData', userWebController.addPlacementData);
router.post('/editPlacementDataById', userWebController.editPlacementDataById);

router.get('/getCompanyHireData',userWebController.getCompanyHireData);
router.post('/getCompanyHireDataByBatch',userWebController.getCompanyHireDatabyBatch);
router.post('/getCompanyHireDataById',userWebController.getCompanyHireDataById);

router.post('/getAllStudentData',userWebController.getAllStudentData);
router.get('/getTopFivePlacements',userWebController.getTop5Placements);
router.post('/getAllPlacedStudentData',userWebController.getAllPlacedStudentsData);

router.post('/manager/profile/edit', userWebController.editManagerProfileById);

module.exports = router;