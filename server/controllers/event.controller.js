const authHelper = require('../helpers/auth.helper');
const graph = require('@microsoft/microsoft-graph-client');
const userModel = require("../models/user.model");
const businessModel = require("../models/business.model");
const moment = require('moment-business-days');
const findDays = require("../helpers/findDays.helper");

const eventController = {
    list: async (req, res) => {
        try {
            // console.log(">>>>",req.params.id)
            const user = await userModel.findOne({ email: req.params.id });
            if (!user) {
                return res.status(400).json({ msg: "User not found or not authorized" });
            }
            let parms = {};
            parms.email = req.params.id;
            const refresh_token = user.refreshtoken;
            const credentials = {
                client: {
                    id: process.env.APP_ID,
                    secret: process.env.APP_PASSWORD
                },
                auth: {
                    tokenHost: 'https://login.microsoftonline.com',
                    authorizePath: 'common/oauth2/v2.0/authorize',
                    tokenPath: 'common/oauth2/v2.0/token'
                }
            };
            const oauth2 = require('simple-oauth2').create(credentials);

            const newToken = await oauth2.accessToken
                .create({
                    refresh_token: refresh_token
                })
                .refresh();
            await authHelper.saveValuesToCookie(newToken, res);

            // Initialize Graph client
            const client = graph.Client.init({
                authProvider: done => {
                    done(null, newToken.token.access_token);
                }
            });

            const businesses = await businessModel.find({
                email: req.params.id
            });
            parms.businesses = businesses;
            //res.render('events/add', parms);
            // console.log({ parms })
            res.json({ event: parms });

        } catch (error) {
            return res.status(500).json({ msg: error.message });
        }
    },
    postCreate: async (req, res) => {
        try {
            const { subject, message, name, client_email, business, time, owner_email } = req.body;
            // START AUTH  

            const user = await userModel.findOne({ email: owner_email });
            if (!user) {

            }

            const refresh_token = user.refresh_token;
            const credentials = {
                client: {
                    id: process.env.APP_ID,
                    secret: process.env.APP_PASSWORD
                },
                auth: {
                    tokenHost: 'https://login.microsoftonline.com',
                    authorizePath: 'common/oauth2/v2.0/authorize',
                    tokenPath: 'common/oauth2/v2.0/token'
                }
            }
            const oauth2 = require('simple-oauth2').create(credentials);
            const newToken = await oauth2.accessToken.create({
                refresh_token: refresh_token
            }).refresh();

            console.log({ newToken })
            await authHelper.saveValuesToCookie(newToken, res);

            //Initialize Graph Client
            const client = await graph.Client.init({
                authProvider: done => {
                    done(null, newToken.token.access_token)
                }
            });

            console.log({ client });
            if (!client) {
                return res.status(401).json({ msg: "UNAUTHORIZED" });
            }
            // END AUTH

            const event = {
                subject: `${business.name}: ${subject}`,
                body: {
                    conentType: 'HTML',
                    conent: message
                },
                start: {
                    dateTime: moment(time).format('YYYY-MM-DDTHH:mm:ss'),
                    timeZone: 'Australia/Brisbane'
                },
                end: {

                },
                location: {
                    displayName: business.address
                },
                attendees: [
                    {
                        emailAddress: {
                            address: client_email,
                            name: name
                        },
                        type: 'required'
                    }
                ]
            }
            const result = await client.api('/me/events').post(event);

            res.json({ event: result });
        } catch (error) {
            console.log(error);
            return res.status(500).json({ msg: error.message });
        }
    },
    getDays: async (req, res) => {
        try {
            const { service, email } = req.body;
            console.log(req.body)
            if (!service || !email) {
                return res.status(400).json({ msg: "Email or Service not found" });
            }
            
            const business = await businessModel.findOne({ name: service });
            if (!business) {
                return res.status(400).json({ msg: "Business not found" });
            }
            // console.log('>>>>>>>', business);

            // days below is a load of moment objects
            const days = findDays(
                business.minLead,
                business.maxLead,
                business.defaultHour * 60 + business.defaultMin,
                business.endTime
            );
            // Construct the response_days
            const formatted_days = days.map(day => day.format('ddd D/MM'));
            console.log({ formatted_days });
            const raw_days = days.map(day => day.format());
            console.log({ raw_days });

            const response_days = [];
            for (let i = 0; i < days.length; i++) {
                response_days[i] = {
                    day: raw_days[i],
                    formatted_day: formatted_days[i]
                }
            }

            // START AUTH
            const user = await userModel.findOne({ email: email });
            const refresh_token = user.refreshtoken;

            const credentials = {
                client: {
                    id: process.env.APP_ID,
                    secret: process.env.APP_PASSWORD
                },
                auth: {
                    tokenHost: 'https://login.microsoftonline.com',
                    authorizePath: 'common/oauth2/v2.0/authorize',
                    tokenPath: 'common/oauth2/v2.0/token'
                }
            };

            const oauth2 = require('simple-oauth2').create(credentials);

            const newToken = await oauth2.accessToken
                .create({
                    refresh_token: refresh_token
                })
                .refresh();

            await authHelper.saveValuesToCookie(newToken, res);

            // Initialize Graph client
            const client = graph.Client.init({
                authProvider: done => {
                    done(null, newToken.token.access_token);
                }
            });
            // END AUTH

            // START GENERATING FREE SLOTS FOR EACH DAY
            // Calculate slots_required
            let interval = business.defaultHour * 60 + business.defaultMin;
            let slots_required = interval / 15;

            // Now we start
            for (let i = 0; i < days.length; i++) {
                let origin_user_startTime;
                let user_startTime;
                let user_endTime = `${moment(response_days[i].day).format(
                    'YYYY-MM-DD'
                )}T${business.endTime}:00`

                // If it's today then start time is now, else it's the starttime of busines
                if (moment(response_days[i].day).isSame(moment(), 'day')) {
                    origin_user_startTime = moment().roundNext15Min();
                    user_startTime = origin_user_startTime.format('YYYY-MM-DDTHH::mm:ss')
                } else {
                    origin_user_startTime = moment(
                        `${moment(response_days[i].day).format('YYYY-MM-DD')}T${business.startTime
                        }:00`
                    );
                    user_startTime = `${moment(response_days[i].day).format(
                        'YYYY-MM-DD'
                    )}T${business.startTime}:00`;
                }

                // Start query to MS
                const scheduleInformation = {
                    schedules: [email],
                    startTime: {
                        dateTime: user_startTime,
                        timeZone: 'Australia/Brisbane'
                    },
                    endTime: {
                        dateTime: user_endTime,
                        timeZone: 'Australia/Brisbane'
                    },
                    availabilityViewInterval: 15
                };

                // Get back the busy slots
                let busy_slots = await client
                    .api('/me/calendar/getSchedule')
                    .header('Prefer', 'outlook.timezone="Australia/Brisbane"')
                    .post(scheduleInformation);

                // Availability view 000222..
                let scheduled_items = busy_slots.value[0].availabilityView;

                // Start generating
                let available_slots = [];
                let slots_taken = 0;
                let current = null;

                for (let i = 0; i < scheduled_items.length; i++) {
                    if (scheduled_items[i] == 0) {
                        slots_taken++;
                        if (current == null) {
                            current = origin_user_startTime.clone().add(i * 15, 'm');
                        }
                        if (slots_taken == slots_required) {
                            available_slots.push(current.format());
                            current = origin_user_startTime.clone().add((i + 1) * 15, 'm');
                            slots_taken = 0;
                        }
                    } else {
                        slots_taken = 0; // get broken
                        current = null;
                    }
                }

                // Finally, add it to each day in response_days
                response_days[i].free_slots = available_slots;
            }
            res.json({ days: response_days });

        } catch (error) {
            console.log(error);
            return res.status(500).json({ msg: error.message });
        }
    }
}

// HELPER FUNCTION TO ROUND TO 15 MINS
moment.fn.roundNext15Min = function () {
    let intervals = Math.floor(this.minutes() / 15);
    if (this.minutes() % 15 != 0) intervals++;
    if (intervals == 4) {
        this.add('hours', 1);
        intervals = 0;
    }
    this.minutes(intervals * 15);
    this.seconds(0);
    return this;
};

//=================

module.exports = eventController