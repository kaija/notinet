var express = require('express');
var router = express.Router();
var r = require('rethinkdb');
var db = require('../db/rethinkdb');
var user = db.user();
/**
 * Create user
 */
router.post('/create', function(req, res, next) {
  var u = {"name":"kevin", "email":"kaija.chang.co@gmail.com"};
  user.create(u, function(e, r){
    res.send('Created');
  });
});

/**
 * Get user data
 */
router.get('/profile/:id', function(req, res, next) {
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
