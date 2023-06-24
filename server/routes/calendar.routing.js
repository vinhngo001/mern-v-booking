const express = require('express');
const router = express.Router();
const calendarCtrl = require("../controllers/calendar.controller");

/**
 * @route GET api/calendar
 * @desc List calendar
 * @access Public
*/
router.get('/list', calendarCtrl.list);

/**
 * @route GET api/calendar
 * @desc List calendar
 * @access Public
*/
router.get('/', calendarCtrl.getCalendar);

module.exports = router;