var express = require('express');
var router = express.Router();
var r = require('rethinkdb');
var crypto = require('crypto');
var db = require('../db/rethinkdb');
var user = db.user();
var auth = require('./index');
var config = require('../config');

function respGen(res, code, errno, err, msg)
{
  if(code == 0) {
    res.status(200);
  }
  var ret = {};
  if(err) {
    ret["error"] = err;
  }else{
    ret["error"] = "";
  }
  ret["errno"] = errno;
  if(msg) {
    ret["result"] = msg;
  }else{
    ret["result"] = "";
  }
  res.send(ret);
}

function md5(str, encoding){
  return crypto
    .createHash('md5')
    .update(str)
    .digest(encoding || 'hex');
};

function ensureAuthenticated(req, res, next) {
  if (req.isAuthenticated()) { return next(); }
  res.status(401);
  res.send("Unauthorized");
}

router.get('/demo', ensureAuthenticated, function(req, res, next){
  res.send(req.user);
});

/**
 * Create user
 */
router.post('/create', function(req, res, next) {
  //var u = {"userName":"kaija", "fullName":"kaija chang", "email":"kaija.chang.co@gmail.com"};
  var u = {};
  //Add username TODO validate a unique user id
  //if(req.body.userName) u['userName'] = req.body.userName;
  if(req.body.fullName) u['fullName'] = req.body.fullName;
  if(req.body.email) u['email'] = req.body.email;
  //TODO password will plaintext in HTTP transfer
  if(req.body.password) {
    ha1 = md5(u.email + ":" + config.site.realm + ":" + req.body.password);
    u['password'] =  ha1;
  }
  user.create(u, function(e, r){
    var en = 0;
    if(e) {
      switch(e) {
        case 'user already exist':
          en = 1001;
          break;
        default:
          en = 0;
          break;
      }
    }
    respGen(res, 200, en, e, r);
  });
});

/**
 * Get user data
 */
router.get('/get', ensureAuthenticated, function(req, res, next) {
  var email = req.user;
  user.get(email, function(err, ret){
    if(ret){
      delete ret['id'];
    }
    respGen(res, 200, 0, err, ret);
  });
});

/**
 * update user data
 */
//router.put('/update', ensureAuthenticated, function(req, res, next) {
router.put('/update', function(req, res, next) {
  //Only update R/W option
  var u = {};
  //u.email = req.user.email;
  if(req.body.fullName) {
    u['fullName'] = req.body.fullName;
  }
  // inject sample data
  //u['fullName'] = 'ke';
  //u['email'] = 'kaija.chang.co@gmail.com';
  user.update(u, function(err, ret){
    respGen(res, 200, 0, err, ret);
  });
});

/**
 * Delete user This API should be hidden from developer
 */
/*
router.delete('/delete/:id', function(req, res, next) {
  res.send('Delete ' + req.params.id);
});
*/

module.exports = router;
