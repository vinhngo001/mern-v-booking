const express = require("express");
const router = express.Router();
const authHelper = require("../helpers/auth.helper");
// const graph = require("@microsoft/microsoft-graph-client");
require('isomorphic-fetch');

//Load Staff Model
const Staff = require("../models/staff.model");
const staffCtrl = require("../controllers/staff.controller");

// LIST / GET
router.get("/list", staffCtrl.list);

// CREATE / GET
router.get("/create", staffCtrl.create);

// CREATE / POST
router.post("/create", staffCtrl.postCreate);

// EDIT /GET
router.get('/edit/:id', async (req, res, next) => {
    const id = req.params.id;
    const accessIdentity = await authHelper.getAccessToken(req.cookies, res);

    if (accessIdentity) {
        const email = accessIdentity.email;

        let parms = {
            title: 'Edit Staff',
            active: {
                staff: true
            },
            user: accessIdentity.username
        };

        Staff.findOne({
            _id: id
        }).then(staff => {
            if (staff.boss != email) {
                res.redirect('/staff/list');
            } else {
                parms.staff = staff;
                res.render('staffs/edit', parms);
            }
        }).catch(err => {
            parms.message = 'Error retrieving messages';
            parms.error = {
                status: `${err.code}: ${err.message}`
            };
            parms.debug = JSON.stringify(err.body, null, 2);
            res.render('errors/error', parms);
        });
    } else {
        res.redirect('/');
    }
});

// DELETE STAFF
router.delete('/delete/:id', async (req, res, next) => {
    const accessIdentity = await authHelper.getAccessToken(req.cookies, res);
    if (accessIdentity) {
        Staff.findOneAndDelete({ _id: req.params.id, boss: accessIdentity.email })
            .then(staff => res.redirect("/staff/list"))
            .catch(err => {
                parms.message = 'Error retrieving messages';
                parms.error = {
                    status: `${err.code}: ${err.message}`
                };
                parms.debug = JSON.stringify(err.body, null, 2);
                res.render('errors/error', parms);
            })
    } else {
        res.redirect("/");
    }
})
module.exports = router;