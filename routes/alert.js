var express = require('express');
var router = express.Router();


/* GET users listing. */
router.post('/trigger', function(req, res, next) {
  //TODO select alert id from DB and start trigger user
  //res.send('respond with a resource');
  var config = require('../demo');
  var gcm = require('node-gcm');
  var gcm_sender = new gcm.Sender(config.GCMApiKey);
  var message = new gcm.Message();
  message.addData('key', 'val');
  var regIds = [''];
  gcm_sender.send(message, regIds, function(err, result){
    console.log(err);
    console.log(result);
  });
  res.send(config);
});

module.exports = router;
