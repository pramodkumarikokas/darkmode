const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const bodyParser= require('body-parser')

const getOtpRouter = require('./routes/getotp');
const loginRouter = require('./routes/login');
const logoutRouter = require('./routes/logout');

const app = express();
app.use(bodyParser.urlencoded({extended: true}))

// db connection
const db =require('./helper/db')();

//Config Files
require('dotenv').config();

// Middleware
const verifyBaseToken=require('./middleware/basetoken');
const verifyTempToken=require('./middleware/temptoken');

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.get("/", (req, res) => {
  res.json({ message: "Welcome to dark application  cheeekk 11." });
}); 
//require("./app/routes/web")(app);

require("./app/routes/category.routes")(app);
require('./app/routes/task.routes')(app);
require('./app/routes/subtask.routes')(app);
require('./app/routes/recent.routes')(app);
require('./app/routes/favorite.routes')(app);
require('./app/routes/member.routes')(app);
require('./app/routes/user.routes')(app);

app.use('/api/getotp', getOtpRouter);
app.use('/api/login', verifyTempToken, loginRouter);
app.use('/api', verifyBaseToken);
app.use('/api/logout', logoutRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

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
