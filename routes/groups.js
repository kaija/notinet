var express = require('express');
var router = express.Router();

/**
 * Create user group
 */
router.post('/create/:id', function(req, res, next) {
  res.send('Create ' + req.params.id);
});

/**
 * Get user group info
 */
router.get('/info/:id', function(req, res, next) {
  res.send('Get ' + req.params.id);
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
