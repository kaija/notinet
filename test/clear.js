var assert = require('assert');
var r = require('rethinkdb');
r.connect({
    "host": "localhost",
    "port": 28015,
    "authKey": "",
    "db": "notinet"
  }, function(err, conn){
    r.dbDrop('notinet').run(conn, function(err, data){
      if(err) console.log(err);
      if(data) console.log(data);
      process.exit();
    });
  }
);

