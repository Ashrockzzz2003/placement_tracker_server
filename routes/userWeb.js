const express = require('express')
const router = express.Router();
const userWebController = require('../controller/userWebController');

router.get('/test', userWebController.test);                        // Test Passed

router.post('/login', userWebController.userLogin);                 // Test Passed
router.post('/register', userWebController.userRegister);           // Test Passed

router.post('/allStudents', userWebController.allStudents);         // Test Passed
router.post('/student', userWebController.getStudent);              // Test Passed
router.post('/student/add', userWebController.addStudent);          // Test Passed
router.post('/student/update', userWebController.updateStudent);    // Pending

router.post('/allPlacements', userWebController.allPlacements);     // Test Passed
router.post('/addPlacementList', userWebController.addPlacementList)
router.post('/placement', userWebController.getPlacement);          // Test Passed
router.post('/placement/add', userWebController.addPlacement);      // Test Passed
router.post('/placement/update', userWebController.updatePlacement);// Pending

router.post('/allCompanies', userWebController.allCompanies);       // Test Passed
router.post('/company', userWebController.companyPlacements);       // Test Passed
router.post('/company/add', userWebController.addCompany)           // Test Passed
router.post('/company/update', userWebController.updateCompany);    // Test Passed

// ADMIN ONLY
router.post('/company/delete', userWebController.deleteCompany);

module.exports = router;