const express = require('express')
const router = express.Router();
const userWebController = require('../controller/userWebController');


router.post('/login', userWebController.userLogin);                 // Test Passed
router.post('/register', userWebController.userRegister);           // Test Passed


router.post('/allPlacements', userWebController.allPlacements);     // Test Passed
router.post('/placement/add', userWebController.addPlacement);      // Test Passed
router.post('/placement/update', userWebController.updatePlacement);// Pending

router.post('/allCompanies', userWebController.allCompanies);       // Test Passed
router.post('/company', userWebController.companyPlacements);       // Test Passed
router.post('/company/add', userWebController.addCompany)           // Test Passed
router.post('/company/update', userWebController.updateCompany);    // Test Passed

// ADMIN ONLY
router.post('/company/delete', userWebController.deleteCompany);

module.exports = router;