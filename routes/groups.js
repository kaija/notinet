var express = require('express');
var r = require('rethinkdb');
var db = require('../db/rethinkdb');
var group = db.group();

var router = express.Router();

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
 * Create user group
 */
router.post('/create', function(req, res, next) {
  var g = {};
  if(req.body.name) {
    g['name'] = req.body.name;
  }else{
    respGen(res, 200, "name field missing", null);
    return;
  }
  //TODO add creator
  //g['creator'] = req.user.email
  //TODO check user exist and type is array
  if(req.body.users) g['members'] = req.body.members;
  else g['members'] = [];
  group.create(g, function(err, ret) {
    respGen(res, 200, err, ret);
  });
});

/**
 * Get user group info
 */
router.get('/list', function(req, res, next) {
  group.list(function(err, ret){
    respGen(res, 200, err, ret);
  });
});

/**
 * Update group info
 */
router.put('/info/:id', function(req, res, next) {
  res.send('Update ' + req.params.id);
});

/**
 * Delete user group
 */
router.delete('/delete/:id', function(req, res, next) {
  res.send('Delete ' + req.params.id);
});

module.exports = router;
