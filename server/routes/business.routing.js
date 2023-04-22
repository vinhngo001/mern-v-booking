const express = require('express');
const router = express.Router();
const businessCtrl = require("../controllers/business.controller");

/**
 * @route GET api/business
 * @desc Get one business
 * @access Public
*/
router.get('/:id', businessCtrl.getOne);

/**
 * @route POST api/business/create
 * @desc Create new business
 * @access Public
*/
router.post('/create', businessCtrl.create);

/**
 * @route GET api/business
 * @desc List business by email
 * @access Public
*/
router.post('/', businessCtrl.list);

/**
 * @route PUT api/business
 * @desc Update one business
 * @access Public
*/
router.put('/:id', businessCtrl.update);

/**
 * @route DELETE api/business
 * @desc Delete one business
 * @access Public
*/
router.delete('/:id', businessCtrl.delete);

module.exports = router;