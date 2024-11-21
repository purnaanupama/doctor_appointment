const express = require('express');
const user_controller = require('../controllers/user_controller.js');

//using express create router
const router = express.Router();


router.post('/register',user_controller.register);

module.exports =  router;