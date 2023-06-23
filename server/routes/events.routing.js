const express = require('express');
const router = express.Router();
const eventCtrl = require("../controllers/event.controller");

/**
 * @route GET api/events
 * @desc CREATE BOOKING
 * @access Public
*/
router.get('/:id', eventCtrl.list);

/**
 * @route POST api/events
 * @desc SUBMIT FORM TO BOOK APPOINTMENT
 * @access Public
*/
router.post('/', eventCtrl.postCreate);

/**
 * @route POST api/events/getDays
 * @desc ENDPOINT POST TO GET FREE DAYS
 * @access Public
*/
router.post('/getDays', eventCtrl.getDays);

module.exports = router;