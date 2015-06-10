var events = require('events');
var fwk = require('fwk');
var r = require('rethinkdb');
var config = require('../config');

function dbConnection() {
  var exp = require('express');
  return exp.db;
}

var user = function(){
  var _super = {};
  var create;
  var update;
  var get;
  var that = new events.EventEmitter();
  that.setMaxListeners(0);

  create = function(u, cb){
    console.log(u);
    r.table(config.db.userTable).filter({'email':u.email}).run(dbConnection()).then(function(cursor) {
      return cursor.toArray();
    }).then(function(result) {
      if(result.length > 0) {
        console.log('user already exist');
        console.log(result);
        cb('user already exist', null);
      }else{
        r.table(config.db.userTable).insert(u).run(dbConnection(), function(err, res){
          if(res) console.log(res);
          if(err) console.log(err);
          cb(err, res);
        });
      }
    });
    /*
  */
  };
  update = function(u, cb){
    r.table(config.db.userTable).filter({'email':u.email}).run(dbConnection()).then(function(cursor) {
      return cursor.toArray();
    }).then(function(result) {
      if(result.length > 0) {
        var ori = result[0];
        for (i in u) {
          ori[i] = u[i];
        }
        r.table(config.db.userTable).replace(ori).run(dbConnection()).then(function(a, b){
          if(a) console.log(a);
          if(b) console.log(b);
          cb(null, 'done');
        });
      }else{
        //TODO user not exist, should not happend
          cb('user not exist', null);
      }
    });
  };
  get = function(id, cb){
    r.table(config.db.userTable).filter({'email':id}).run(dbConnection()).then(function(cursor) {
      return cursor.toArray();
    }).then(function(result) {
      console.log(result);
      if(result.length > 0) {
        cb(null, result[0]);
      }else{
        cb('user not exist', null);
      }
    });
  };
  fwk.method(that, 'create', create, _super);
  fwk.method(that, 'update', update, _super);
  fwk.method(that, 'get', get, _super);
  return that;
};


var project = function(){
  var _super = {};
  var create;
  var that = new events.EventEmitter();
  that.setMaxListeners(0);

  create = function(p){
    r.dbList().run(dbConnection(), function(err, data){
      console.log(data);
    });
  };
  update = function(){
    console.log('yo updated');
  };
  get = function(){
    console.log('yo get');
  };
  fwk.method(that, 'create', create, _super);
  fwk.method(that, 'update', update, _super);
  fwk.method(that, 'get', get, _super);
  return that;
}

var test = function() {
  var _super = {};
  var destroyDB;
  var that = new events.EventEmitter();
  that.setMaxListeners(0);

  destroyDB = function(cb){
    r.dbDrop.run(dbConnection(), function(err, data){
      cb(err, data);
    });
  };
  fwk.method(that, 'destroyDB', destroyDB, _super);
  return that;
}

exports.user = user;
exports.project = project;
exports.test = test;
