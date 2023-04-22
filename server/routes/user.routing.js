const express = require('express')
const router = express.Router();

/**
 * @route GET users
 * @desc GET users.
 * @access Private
*/
router.get('/', function (req, res, next) {
    res.send('respond with a resource');
});
module.exports = router
