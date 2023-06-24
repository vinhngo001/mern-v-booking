const authHelper = require('../helpers/auth.helper');
const graph = require('@microsoft/microsoft-graph-client');
require('isomorphic-fetch');
const calendarController = {
    list: async (req, res) => {
        try {
            const accessIndetity = await authHelper.getAccessToken(req.cookies, res);
            if (accessIndetity) {
                let parms = {
                    title: 'calendar',
                    active: {
                        calendar: true,
                    },
                    user: accessIndetity.username
                }

                // Initialize Graph Client
                const client = graph.Client.init({
                    authProvider: (done) => {
                        done(null, accessIndetity.accessToken)
                    }
                });

                // Set start of the calendar view to today at midnight
                const start = new Date(new Date().setHours(0, 0, 0));

                // Set end of the calendar view to 7 days from start
                const end = new Date(new Date(start).setDate(start.getDate() + 7));

                // Get the first 10 events for the coming week
                const result = await client
                    .api(`/me/calendarView?startDateTime=${start.toISOString()}&endDateTime=${end.toISOString()}`)
                    .top(10).select('subject, start, end,attendees');
                parms.events = result.value;

                res.json(parms);
                // res.render('calendar/index',parms)
            } else {
                return res.status(400).json({ msg: "Access denined" });
            }
        } catch (error) {
            console.log(error);
            return res.status(500).json({ msg: error.message });
        }
    },
    getCalendar: async (req, res) => {
        try {
            const accessIndetity = await authHelper.getAccessToken(req.cookies, res);
            if (accessIndetity) {
                let parms = {
                    title: 'calendar',
                    active: {
                        calendar: true,
                    },
                    user: accessIndetity.username
                }

                // Initialize Graph Client
                const client = graph.Client.init({
                    authProvider: (done) => {
                        done(null, accessIndetity.accessToken)
                    }
                });

                // Set start of the calendar view to today at midnight
                const start = new Date(new Date().setHours(0, 0, 0));

                // Set end of the calendar view to 7 days from start
                const end = new Date(new Date(start).setDate(start.getDate() + 7));

                // Get the first 10 events for the coming week
                const result = await client
                    .api(`/me/calendarView?startDateTime=${start.toISOString()}&endDateTime=${end.toISOString()}`)
                    .top(10).select('subject, start, end,attendees');
                parms.events = result.value;

                // res.json(parms);
                res.render('calendar/index',parms);
            } else {
                return res.status(400).json({ msg: "Access denined" });
            }
        } catch (error) {
            console.log(error);
            return res.status(500).json({ msg: error.message });
        }
    }
}

module.exports = calendarController