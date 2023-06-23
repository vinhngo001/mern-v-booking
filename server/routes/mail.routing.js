const express = require('express');
const router = express.Router();
const authHelper = require('../helpers/auth.helper');
require('isomorphic-fetch');
const graph = require('@microsoft/microsoft-graph-client');

router.get("/", async (req, res, next) => {
    const accessIdentity = await authHelper.getAccessToken(req.cookies, res);
    if(accessIdentity){
        let parms = {
            title: "Mails",
            active:{
                inbox: true
            },
            user: accessIdentity.username
        }

        // Initialize Graph Client
        const client = graph.Client.init({
            authProvider: (done) => {
                done(null, accessIdentity.access_token);
            }
        });

        try {
            
        } catch (err) {
            console.log(err.message);
            parms.message = 'Error retrieving messages';
            parms.error = {
                status: `${err.code}: ${err.message}`
            };
            parms.debug = JSON.stringify(err.body, null, 2);
            next(err);
        }
    }else{
        res.redirect("/");
    }
});

module.exports = router;