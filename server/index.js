// LOAD ENV IN .env into process.env. This contains auth stuff
require('dotenv').config();
const express = require('express');
const path = require('path');
const exphbs = require('express-handlebars');
const bodyParser = require('body-parser');
const methodOverride = require('method-override');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const createRouter = require("./routes/index.routing");
const connectDB = require("./configs/db.config");
// Handlebars helpers
const { select } = require('./helpers/hbs.helper');

// Map global Promises
// mongoose.Promise = global.Promise;

// Mongoose connect
connectDB();

//==START APP
const app = express();

// Body parser middleware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cookieParser());
app.use(express.json());

// Cors middleware
app.use(cors());
app.options('*', cors());


// Handlebars middleware
app.engine(
    'handlebars',
    exphbs.engine({
        helpers: {
            select: select
        }, // To import the helpers function for rendering hbs so that you can use these functions in handlebars file
        defaultLayout: 'main' // If you dont set this, defaultLayout will be "layout.handlebars"
    })
);
app.set('view engine', 'handlebars');

// Static folder: Tell app this is the static folder with css, front-end views, images.
app.use(express.static(path.join(__dirname, 'public')));

// Method override middleware
app.use(methodOverride('_method'));

// =========== CONTINUE ROUTES MIDDLEWARE
createRouter(app);

if (process.env.NODE_ENV === "production") {
    app.use(express.static("client/build"))
    app.get("*", (req, res) => {
        res.sendFile(path.join(__dirname, "client", "build", "index.html"))
    })
}
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`Server started on port ${PORT}`))
