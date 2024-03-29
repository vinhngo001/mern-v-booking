const authHelper = require("../helpers/auth.helper");
// const graph = require("@microsoft/microsoft-graph-client");
require('isomorphic-fetch');

//Load Staff Model
const Staff = require("../models/staff.model");

const staffController = {
    list: async (req, res, next) => {
        const accessIdentity = await authHelper.getAccessToken(req.cookies, res);
        if (accessIdentity) {
            let parms = {
                title: 'All Staff',
                active: {
                    staff: true
                },
                user: accessIdentity.username
            }
            // console.log({accessIdentity})
            // Get all businesss
            Staff.find({
                boss: accessIdentity.email
            }).then(staffs => {
                parms.staffs = staffs
                res.render("staffs/index", parms);
            }).catch(err => {
                console.error(err.message);
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
    },
    create: async (req, res, next) => {
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
            console.error(err.message);
            parms.message = 'Error retrieving messages';
            parms.error = {
                status: `${err.code}: ${err.message}`
            };
            parms.debug = JSON.stringify(err.body, null, 2);
            res.render('errors/error', parms);
        }
    },
    postCreate: async (req, res, next) => {
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
                .catch(err => {
                    console.log(err.message);
                    parms.message = 'Error retrieving messages';
                    parms.error = {
                        status: `${err.code}: ${err.message}`
                    };
                    parms.debug = JSON.stringify(err.body, null, 2);
                    res.render('errors/error', parms);
                });
        } else {
            res.redirect("/");
        }
    },
    edit: async (req, res, next) => {
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
    },
    putEdit: async (req, res, next) => {
        const accessIdentity = await authHelper.getAccessToken(req.cookies, res);
        if (accessIdentity) {
            Staff.findOneAndUpdate(
                {
                    _id: req.params.id,
                    boss: accessIdentity.email
                },
                { ...req.body },
                { new: true, runValidators: true })
                .then(staff => res.redirect("/staff/list"))
                .catch(err => {
                    parms.message = 'Error retrieving messages';
                    parms.error = {
                        status: `${err.code}: ${err.message}`
                    };
                    parms.debug = JSON.stringify(err.body, null, 2);
                    res.render('errors/error', parms);
                });
        } else {
            res.redirect("/");
        }
    },
    delete: async (req, res, next) => {
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
    }
}

module.exports = staffController;