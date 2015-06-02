var express = require('express');
var router = express.Router();
var r = require('rethinkdb');
var c = require('../database');
/**
 * Create user
 */
router.post('/create/:id', function(req, res, next) {
  res.send('Create ' + req.params.id);
});

/**
 * Get user data
 */
router.get('/profile/:id', function(req, res, next) {
  var c = express.db;
  r.dbList().run(c, function(err, data){
    console.log(data);
  });
  res.send('Get ' + req.params.id);
});

/**
 * update user data
 */
router.put('/profile/:id', function(req, res, next) {
  res.send('Update ' + req.params.id);
});

/**
 * Delete user
 */
router.delete('/delete/:id', function(req, res, next) {
  res.send('Delete ' + req.params.id);
});

module.exports = router;
