'use strict';

// Express
var express = require('express'),
    forceSSL = require('express-force-ssl'),
    createError = require('http-errors'),
    i18n = require("i18n"),
    path = require('path'),
    cookieParser = require('cookie-parser'),
    logger = require('morgan'),
    handlebars = require("express-handlebars"),
    compression = require('compression'),
    session = require('express-session'),
    lessMiddleware = require('less-middleware'),
    mongoose = require('mongoose'),
    app = module.exports = express();

// Load config
var config = require('./config.json');
app.set('config', config);

// ForceSSL
if(config.forceSSL) {
  app.use(forceSSL);
}

// Setup multi language support
var i18nconfig = {
  locales:['en', 'de'],
  defaultLocale: 'en',
  cookie: 'lang',
  queryParameter: 'lang',
  directory: path.join(__dirname,'resources','private','locales')
};
i18n.configure(i18nconfig);
app.set('i18nconfig', i18nconfig);

// Setup default database connection
var mongoDB = `mongodb://${config.mongoHost}/${config.mongoDB}`;
mongoose.connect(mongoDB, { useCreateIndex: true, useNewUrlParser: true, useFindAndModify: false });
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));

// View engine setup
var hbsConfig = {
  defaultLayout: "main",
  extname: ".hbs",
  helpers: require(path.join(__dirname, 'resources', 'private', 'helpers','handlebars.js')).helpers,
  partialsDir: path.join(__dirname, 'resources', 'private', 'partials'),
  layoutsDir: path.join(__dirname, 'resources', 'private', 'layouts'),
  templatesDir: path.join(__dirname, 'resources', 'private', 'templates')
};
app.engine("hbs", handlebars(hbsConfig));
app.set('views', hbsConfig.templatesDir);
app.set("view engine", "hbs");
app.set("hbsConfig", hbsConfig);

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(compression());
app.use(lessMiddleware(path.join(__dirname, 'resources', 'public')));
app.use(express.static(path.join(__dirname, 'resources', 'public')));
app.use(session({
  secret: config.cookieSecret,
  resave: true,
  saveUninitialized: true
}));

// Global language switch and language initialisation
app.use(function (req, res, next) {
  if(req.query.lang) {
    res.cookie('lang', req.query.lang, { maxAge: 365 * 24 * 60 * 60 * 1000, httpOnly: true });
    return res.redirect('/');
  }
  else {
    if( typeof req.cookies['lang'] === 'undefined') {
      req.cookies['lang'] = i18n.getLocale(req);
      res.cookie('lang', i18n.getLocale(req), { maxAge: 365 * 24 * 60 * 60 * 1000, httpOnly: true });
    }
  }
  i18n.setLocale(req.cookies['lang']);
  next();
});
app.use(i18n.init);

// Require models
let Applicant = require(path.join(__dirname, 'src', 'models', 'applicant'));
let Lottery = require(path.join(__dirname, 'src', 'models', 'lottery'));
let User = require(path.join(__dirname, 'src', 'models', 'user'));
let Media = require(path.join(__dirname, 'src', 'models', 'media'));
let Setup = require(path.join(__dirname, 'src', 'models', 'setup'));

// Refresh user session object if user is active on each request
app.all('*', (req,res,next) => {
  if(typeof req.session.user !== 'undefined') {
    User.findById(req.session.user._id).then((user) => {
      req.session.user = user;
    }).catch((usererror) => {
      console.log(usererror);
    });
  }
  next();
});

// Apply views
app.use('/', require(path.join(__dirname, 'src', 'views', 'index')));
app.use('/logout', require(path.join(__dirname, 'src', 'views', 'logout')));
app.use('/signup', require(path.join(__dirname, 'src', 'views', 'signup')));
app.use('/signin', require(path.join(__dirname, 'src', 'views', 'signin')));
app.use('/passwordrequest', require(path.join(__dirname, 'src', 'views', 'passwordrequest')));
app.use('/account', require(path.join(__dirname, 'src', 'views', 'account')));
app.use('/profile', require(path.join(__dirname, 'src', 'views', 'profile')));
app.use('/lotterys', require(path.join(__dirname, 'src', 'views', 'lotterys')));
app.use('/setup', require(path.join(__dirname, 'src', 'views', 'setup')));
app.use('/public', require(path.join(__dirname, 'src', 'views', 'public')));
app.use('/static', require(path.join(__dirname, 'src', 'views', 'static')));

// Catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// Error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});
