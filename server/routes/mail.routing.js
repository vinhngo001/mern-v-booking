const express = require('express');
const router = express.Router();
const mailCtrl = require("../controllers/mail.controller");

/* GET /mail */
router.get('/', mailCtrl.get);

module.exports = router;