var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var flash = require('express-flash');
var session = require('express-session');
var mongoose = require('mongoose');

//Read the mLab connetion URL
var config = require('./config/db_config');
var db_url = process.env.MONGO_URL;

//And connect to the database.
mongoose.connect(db_url)
    .then( () => {console.log('connected to mLab');})
    .catch( (err) => { console.log('error connecting to mLab', err);});

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

app.use(session({secret: 'top secret', resave: false, saveUninitialized: false}));
app.use(flash());

app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development

    if(err.kind ==='ObjectId' && err.name == 'CastError'){
      err.status = 404;
      err.message = "ObjectId Not Found";
    }

  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
