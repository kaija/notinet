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
    r.table(config.db.userTable).filter({'email':u.email}).run(dbConnection()).then(function(cursor) {
      return cursor.toArray();
    }).then(function(result) {
      if(result.length > 0) {
        cb('user already exist', null);
      }else{
        r.table(config.db.userTable).insert(u).run(dbConnection(), function(err, res){
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


var group = function(){
  var _super = {};
  var create;
  var update;
  var get;
  var list;
  var remove;
  var that = new events.EventEmitter();
  that.setMaxListeners(0);
  create = function(g, cb){
    r.table(config.db.groupTable).filter({'name':g.name}).run(dbConnection()).then(function(cursor) {
      return cursor.toArray();
    }).then(function(result) {
      if(result.length > 0) {
        cb('group already exist', null);
      }else{
        r.table(config.db.groupTable).insert(g).run(dbConnection(), function(err, res){
          cb(err, res);
        });
      }
    });
  };
  update = function(g, cb){
    r.table(config.db.groupTable).filter({'id':g.id}).run(dbConnection()).then(function(cursor) {
      return cursor.toArray();
    }).then(function(result) {
      if(result.length > 0) {
        var ori = result[0];
        //Update json field
        for (i in u) {
          ori[i] = g[i];
        }
        r.table(config.db.groupTable).replace(ori).run(dbConnection()).then(function(a, b){
          cb(null, 'done');
        });
      }else{
        //TODO user not exist, should not happend
          cb('group not exist', null);
      }
    });
  };
  get = function(id, cb){
    r.table(config.db.groupTable).get(id).run(dbConnection()).then(function(cursor) {
      return cursor.toArray();
    }).then(function(result) {
      if(result.length > 0) {
        cb(null, result[0]);
      }else{
        cb('user not exist', null);
      }
    });
  };
  list = function(cb){
    r.table(config.db.groupTable).run(dbConnection()).then(function(cursor) {
      return cursor.toArray();
    }).then(function(result) {
      if(result.length > 0) {
        cb(null, result);
      }else{
        cb('no group available', null);
      }
    });
  };
  remove = function(id, cb){
    r.table(config.db.groupTable).get(id).delete().run(dbConnection()).then(function(err, res) {
      cb(err, res);
    });
  };
  fwk.method(that, 'create', create, _super);
  fwk.method(that, 'update', update, _super);
  fwk.method(that, 'get', get, _super);
  fwk.method(that, 'list', list, _super);
  fwk.method(that, 'remove', remove, _super);
  return that;
}

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
  var waitReady;
  var that = new events.EventEmitter();
  that.setMaxListeners(0);
  destroyDB = function(cb){
    console.log("Connect");
    r.connect({
      "host": "localhost",
      "port": 28015,
      "authKey": "",
      "db": "notinet"
      }, function(err, conn){
        console.log(conn);
        r.dbDrop('notinet').run(conn, function(err, data){
          cb(err, data);
        });
      }
    );
  };
  fwk.method(that, 'destroyDB', destroyDB, _super);
  return that;
}

exports.user = user;
exports.project = project;
exports.group = group;
exports.test = test;
