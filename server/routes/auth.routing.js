const express = require('express');
const router = express.Router();
const authCtrl = require("../controllers/auth.controller");

/**
 * @route GET api/auth
 * @desc Check if user is logged in
 * @access Public
*/
router.get('/authorize', authCtrl.getAuth);

/** 
 * @route GET api/auth/authorize
 * @desc Register user
 * @access Public
*/
router.get('/', authCtrl.authorize)

/**  
 * @route GET api/auth/signout
 * @desc Sign out
 * @access Public
*/

router.get('/authorize/signout', authCtrl.signOut);

module.exports = router
