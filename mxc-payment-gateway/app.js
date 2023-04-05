const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const logger = require('morgan');
const mongoose = require("mongoose");
require('dotenv').config()

const indexRouter = require('./routes/index');
const apiRouter = require('./routes/api');
const authRouter = require('./routes/auth');
const adminRouter = require('./routes/admin');
const oracleRouter = require('./routes/oracle');

const { createSuperInitialAdmin } = require('./controllers/auth.controller');
const runCronJobs = require('./cronjob');

// Connect database
const db_url = process.env.MONGODB_URI || "mongodb://localhost:27017/max-erc20";
mongoose
  .connect(db_url, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then( async() => {
    console.log("Successfully connected to the database!");
    const result = await createSuperInitialAdmin();
    if (!result) {
      throw "Initial admin does not exist. Try again.";
    }
  })
  .catch((err) => {
    console.log("Cannot connect to the database!", err);
    process.exit();
  });

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(bodyParser.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  next();
});

app.use('/', indexRouter);
app.use('/api', apiRouter);
app.use('/auth', authRouter);
app.use('/admin', adminRouter);
app.use('/oracle', oracleRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// CronJob
runCronJobs();

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
