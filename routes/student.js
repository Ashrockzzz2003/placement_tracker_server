const express = require('express')
const router = express.Router();
const studentcontroll = require('../controller/student');

router.post('/studentRegister', studentcontroll.studentRegister);
router.post('/studentLoginVerify', studentcontroll.studentVerify);
router.post('/studentEditData', studentcontroll.studentEditData);
router.post('/addStudent', studentcontroll.addStudent);

router.post('/getStudentPlacements', studentcontroll.getStudentPlacements);
router.post('/getAllStudentData',studentcontroll.getAllStudentData);
router.post('/getAllPlacedStudentData',studentcontroll.getAllPlacedStudentsData);