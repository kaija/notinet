var express = require('express');
var router = express.Router();

var config = require('../config.json');
if(!config.GCMApiKey) {
  
}
var gcm = require('node-gcm');

var gcm_sender = new gcm.Sender(config.GCMApiKey);

/* GET users listing. */
router.get('/', function(req, res, next) {
  //res.send('respond with a resource');
  res.send(config);
});

module.exports = router;
