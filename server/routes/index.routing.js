const authRouter = require("./auth.routing");
const userRouter = require("./user.routing");
const businessRouter = require("./business.routing");
const calendarRouter = require("./calendar.routing");
const eventRouter = require("./events.routing");
const staffRouter = require("./staff.routing");
const mailRouter = require("./mail.routing");

// const baseUrl = '/api';

function createRouter(app) {
    app.use('/', authRouter);
    app.use('/user', userRouter);
    app.use('/business', businessRouter);
    app.use('/calendar', calendarRouter);
    app.use('/events', eventRouter);
    app.use('/staff', staffRouter);
    app.use('/mail', mailRouter);
}

module.exports = createRouter