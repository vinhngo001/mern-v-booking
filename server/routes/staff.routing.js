const express = require("express");
const router = express.Router();
const staffCtrl = require("../controllers/staff.controller");

// LIST / GET
router.get("/list", staffCtrl.list);

// CREATE / GET
router.get("/create", staffCtrl.create);

// CREATE / POST
router.post("/create", staffCtrl.postCreate);

// EDIT /GET
router.get('/edit/:id', staffCtrl.edit);

// EDIT /PUT
router.put('/edit/:id', staffCtrl.putEdit);

// DELETE STAFF
router.delete('/delete/:id',staffCtrl.delete)
module.exports = router;