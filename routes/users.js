var express = require('express');
var router = express.Router();
var r = require('rethinkdb');
var db = require('../db/rethinkdb');
var user = db.user();

function respGen(res, code, err, msg)
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
  if(msg) {
    ret["result"] = msg;
  }else{
    ret["result"] = "";
  }
  res.send(ret);
}

/**
 * Create user
 */
router.post('/create', function(req, res, next) {
  var u = {"name":"kevin", "email":"kaija.chang.co@gmail.com"};
  user.create(u, function(e, r){
    respGen(res, 200, e, r);
  });
});

/**
 * Get user data
 */
router.get('/profile/:id', function(req, res, next) {
  //TODO id should obtain from passport auth module
  user.get(req.params.id, function(err, ret){
    if(ret){
      delete ret['id'];
    }
    respGen(res, 200, err, ret);
  });
});

/**
 * update user data
 */
router.put('/profile/:id', function(req, res, next) {
  res.send('Update ' + req.params.id);
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
