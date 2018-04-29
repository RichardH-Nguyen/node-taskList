var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var flash = require('express-flash');
var passport = require('passport');
var session = require('express-session');
var mongoose = require('mongoose');
var MongoDBStore = require('connect-mongodb-session')(session);
var passportConfig = require('./config/passport')(passport);

//Read the mLab connetion URL
var db_url = process.env.MONGO_URL;

// connect to the database.
mongoose.Promise = global.Promise;
mongoose.connect(db_url)
    .then( () => {console.log('connected to MongoDB');})
    .catch( (err) => { console.log('error connecting to MongoDB', err);});

var auth = require('./routes/auth');
var tasks = require('./routes/tasks');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

app.use(express.static(path.join(__dirname, 'public')));

require('./config/passport')(passport);


var store = MongoDBStore({uri : db_url, collection : 'tasks_sessions'});

app.use(session({
    secret: 'replace with long random string',
    resave: true,
    saveUninitialized: true,
    store: store
}));

app.use(passport.initialize());
app.use(passport.session());

app.use(flash());

app.use('/auth', auth);
app.use('/', tasks);


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
