const express = require('express')
const router = express.Router();
const managercontroll = require('../controller/manager');

router.get('/test', managercontroll.test);

router.post('/toggleOfficialStatus', managercontroll.toggleOfficialAccountStatus);
router.get('/getRegisteredOfficials', managercontroll.getRegisteredOfficials);
router.post('/registerOfficial', managercontroll.registerOfficial);

router.post('/addCompany', managercontroll.addCompany);
router.get('/getCompanies', managercontroll.getCompanies);

router.get('/getTopFivePlacements',managercontroll.getTop5Placements);
router.post('/addPlacementData', managercontroll.addPlacementData);
router.post('/editPlacementDataById', managercontroll.editPlacementDataById);

router.get('/getCompanyHireData',managercontroll.getCompanyHireData);
router.post('/getCompanyHireDataByBatch',managercontroll.getCompanyHireDatabyBatch);
router.post('/getCompanyHireDataById',managercontroll.getCompanyHireDataById);
