const express = require('express');
const passport = require('passport');
const Strategy = require('passport-local').Strategy;
const fakeDB = require('./fakeDB/users');
const morgan = require('morgan');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const expressSession = require('express-session');
const connectEnsureLogin = require('connect-ensure-login');
const path = require('path');

const app = express();

passport.use(new Strategy(
  function(username, password, cb) {
    fakeDB.findByUsername(username, function(err, user) {
      if (err) { return cb(err); }
      if (!user) { return cb(null, false); }
      if (user.password != password) { return cb(null, false); }
      return cb(null, user);
    });
  }));

passport.serializeUser(function(user, cb) {
  cb(null, user.id);
});

passport.deserializeUser(function(id, cb) {
  fakeDB.findById(id, function (err, user) {
    if (err) { return cb(err); }
    cb(null, user);
  });
});

app.use(morgan('combined'));
app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(expressSession({ secret: 'secret secret', resave: false, saveUninitialized: false }));
app.use(passport.initialize());
app.use(passport.session());

app.use('/login',  express.static(path.join(__dirname, '/client/login.html')));

app.use('/private', connectEnsureLogin.ensureLoggedIn('/login'), express.static(path.join(__dirname, '/client/public')));
  
app.post('/login', 
  passport.authenticate('local', { failureRedirect: '/login' }),
  function(req, res) {
    res.redirect('/private');
  });
  
app.get('/logout',
  function(req, res){
    req.logout();
    res.redirect('/login');
  });

app.listen(3000);
