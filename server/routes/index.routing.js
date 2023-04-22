const authRouter = require("./auth.routing");
const userRouter = require("./user.routing");
const businessRouter = require("./business.routing");
const calendarRouter = require("./calendar.routing");
const eventRouter = require("./events.routing");

// const baseUrl = '/api';

function createRouter(app) {
    app.use('/', authRouter);
    app.use('/user', userRouter);
    app.use('/business', businessRouter);
    app.use('/calendar', calendarRouter);
    app.use('/events', eventRouter);
}

module.exports = createRouter