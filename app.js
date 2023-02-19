const path = require('path');
const express = require('express');
const dotenv = require('dotenv');
const morgan = require('morgan');
const exphbs = require('express-handlebars');
const passport = require('passport');
const session = require('express-session');
const connectDB = require('./config/db');

// Load config
dotenv.config({ path: './config/config.env' });

// Passport config
require('./config/passport')(passport);

// Connect to database
connectDB();

// initialize app
const app = express();

// log http requests, responses and errors
if (process.env.NODE_ENV === 'development') {
    app.use(morgan('dev'));
}

// Handlebars
app.engine('.hbs', exphbs.engine({ defaultLayout: 'main', extname: '.hbs' }));
app.set('view engine', '.hbs');

// Sessions
app.use(session({
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized: false
}));

// Passport middleware
app.use(passport.initialize());
app.use(passport.session());

// Static folder
app.use(express.static(path.join(__dirname, 'public')));

// Routes
app.use('/', require('./routes/index'));

// port
const PORT = process.env.PORT || 5000;

app.listen(PORT, console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`));
