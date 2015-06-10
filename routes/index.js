var express = require('express');
var session = require('express-session');
var passport = require('passport');
var session = require('express-session');
var FacebookStrategy = require('passport-facebook').Strategy;
var GoogleStrategy = require('passport-google-oauth2').Strategy;
var DigestStrategy = require('passport-http').DigestStrategy;

var db = require('../db/rethinkdb');
var user = db.user();
var router = express.Router();
var config = require('../config');

var users = [
    { id: 1, username: 'bob', password: 'secret', email: 'bob@example.com' }
  , { id: 2, username: 'joe', password: 'birthday', email: 'joe@example.com' }
];

function findByUsername(username, fn) {
  for (var i = 0, len = users.length; i < len; i++) {
    var user = users[i];
    if (user.username === username) {
      return fn(null, user);
    }
  }
  return fn(null, null);
}

/*
var poolModule = require('generic-pool');
var pool = poolModule.Pool({
  name: 'dynamodb',
  create: function(callback) {
    var ddb = require('dynamodb').ddb({
      accessKeyId: config.dynamodb.accessKeyId,
      secretAccessKey: config.dynamodb.secretAccessKey,
      endpoint: config.dynamodb.endpoint
    });
    callback(null, ddb);
  },
  destroy: function(ddb) {
  },
  max: 10,
  min: 2,
  refreshIdle: false,
  log: false
});

function findUser(key){
  return new Promise(function(accept, reject){
    pool.acquire(function(err, client){
      if (client) {
        console.log('Lookup ' + key + ' in table:' + config.dynamodb.userTable);
        client.getItem(config.dynamodb.userTable, key, null, {}, function(err, res, cap){
          if(err) {
            reject(err.statusCode);
          }
          //if(cap) console.log(cap);
          if (res) {
            console.log(res);
            accept(res);
          } else {
            reject(404);
          }
          pool.release(client);
        });
      }
    });
  });
}
*/
/*!
 * Register passport to router
 */

router.use(session({
  secret: config.site.sessionSecret
}));
router.use(passport.initialize());
router.use(passport.session());

passport.serializeUser(function(user, done) {
  done(null, user);
});
passport.deserializeUser(function(obj, done) {
  done(null, obj);
});

function ensureAuthenticated(req, res, next) {
  if (req.isAuthenticated()) { return next(); }
  res.status(401);
  res.send("Unauthorized");
}

/*!
 * Local Digest strategy
 */
passport.use(new DigestStrategy({ qop: 'auth' , realm: config.site.realm},
  function(username, done) {
    // Find the user by username.  If there is no user with the given username
    // set the user to `false` to indicate failure.  Otherwise, return the
    // user and user's password.
    user.get(username, function(err, res){
      if(err) return done(err);
      var password = {};
      password['ha1'] = res.password;
      return done(null, username, password);
    });
  },
  function(params, done) {
    // asynchronous validation, for effect...
    process.nextTick(function () {
      // check nonces in params here, if desired
      return done(null, true);
    });
  }
));


/*!
 * Facebook oauth passport setting
 */
passport.use(new FacebookStrategy({
    clientID: config.facebook.clientID,
    clientSecret: config.facebook.clientSecret,
    callbackURL: config.site.baseURL + config.facebook.callbackPath
  },
  function(accessToken, refreshToken, profile, done) {
    //email as index, remember convert to lowercase
    /*
    var index = profile.emails[0].value.toLowerCase();
    findUser(index).then(function(user){
      //TODO
      //update access token
    }).catch(function(err){
      //TODO
      //create user profile
      var newUser = {'index': index, 'email': profile.emails[0], 'name': profile.displayName};
      console.log(newUser);
    });
    */
    return done(null, profile);
  }
));

/*!
 * Google oauth passport setting
 */
passport.use(new GoogleStrategy({
    clientID: config.google.clientID,
    clientSecret: config.google.clientSecret,
    callbackURL: config.site.baseURL + config.google.callbackPath,
    passReqToCallback   : true
  },
  function(request, accessToken, refreshToken, profile, done) {
    return done(null, profile);
  }
));


router.get('/facebook', passport.authenticate('facebook', {scope: config.facebook.scope}));
router.get('/facebook/callback',
  passport.authenticate('facebook', { successRedirect: config.facebook.successRedirect,
                                      failureRedirect: config.facebook.failureRedirect }));

router.get('/google', passport.authenticate('google', {scope: config.google.scope}));
router.get('/google/callback',
  passport.authenticate('google', { successRedirect: config.google.successRedirect,
                                    failureRedirect: config.google.failureRedirect }));
router.get('/account', ensureAuthenticated, function(req, res){
  res.send(JSON.stringify(req.query) + JSON.stringify(req.body) + JSON.stringify(req.user));
});

router.post('/login', passport.authenticate('digest', { session: true }),
  function(req, res, next) {
    res.send("OK");
  }
);

router.get('/test', ensureAuthenticated, function(req, res, next) {
  res.send(req.user);
});

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

module.exports = router;
