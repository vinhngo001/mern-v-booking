const express = require("express");
const router = express.Router();
const authHelper = require("../helpers/auth.helper");
const graph = require("@microsoft/microsoft-graph-client");
require('isomorphic-fetch');

const mongoose = require("mongoose");


//Load Staff Model
const staff = require("../models/staff.model");

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
})

module.exports = router;