const express = require("express");
const router = express.Router();
const authHelper = require("../helpers/auth.helper");
const graph = require("@microsoft/microsoft-graph-client");
require('isomorphic-fetch');

const mongoose = require("mongoose");


//Load Staff Model
const Staff = require("../models/staff.model");

// CREATE / GET
router.get("/create", async (req, res) => {
    try {
        const accessIdentity = await authHelper.getAccessToken(req.cookies, res);

        if (accessIdentity) {
            let parms = {
                title: 'New Staff',
                active: {
                    staff: true
                },
                user: accessIdentity.username
            };
            res.render('staffs/add', parms);
        } else {
            res.redirect('/');
        }
    } catch (error) {
        console.log(error);
        return res.status(500).json(error.message);
    }
});

// LIST / GET
router.get("/list", async (req, res, next) => {
    const accessIdentity = await authHelper.getAccessToken(req.cookies, res);
    if (accessIdentity) {
        let parms = {
            title: 'All Staff',
            active: {
                staff: true
            },
            user: accessIdentity.username
        }

        // Get all businesss
        Staff.find({
            boss: accessIdentity.email
        }).then(staffs => {
            parms.staffs = staffs
            res.render("staffs/index", parms);
        }).catch(err => {
            console.error(err.message);
            next(err);
        })
    } else {
        res.redirect("/");
    }
});

router.post("/create", async (req, res, next) => {
    const { email, phone, name } = req.body;
    const accessIdentity = await authHelper.getAccessToken(req.cookies, res);
    if (accessIdentity) {
        const boss_email = accessIdentity.email;
        const newStaff = {
            boss: boss_email,
            ...req.body
        }
        new Staff({ ...newStaff })
            .save()
            .then(staff => res.redirect("/staff/list"))
            .catch(err => next(err));
    } else {
        res.redirect("/");
    }
})
module.exports = router;