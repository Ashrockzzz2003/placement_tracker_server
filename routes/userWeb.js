const express = require('express')
const router = express.Router();

const authrouter = require('./auth');
const studentrouter = require('./student'); 
const managerrouter = require('./manager'); 

router.use('/auth', authrouter); 
router.use('/student', studentrouter); 
router.use('/manager', managerrouter); 