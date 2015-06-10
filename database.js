var express = require('express');
var async = require('async');
var r = require('rethinkdb');
var dbConfig = require('./config.json').rethinkdb;
var logger = require('winston');
//TODO remove rethink db function, add create database / table from db/rethinkdb.js
async.waterfall([
  //Connect to RethinkDB
  function connect(callback) {
    r.connect(dbConfig, callback)
  },
  //Create Databse if not exist
  function createDatabase(connection, callback) {
    r.dbList().contains(dbConfig.db).do(function(containsDb) {
      return r.branch(
        containsDb,
        {created: 0},
        r.dbCreate(dbConfig.db)
      );
    }).run(connection, function(err) {
      callback(err, connection);
    });
  },
  //Create Table if not exist
  function createTable(connection, callback) {
    r.tableList().contains('users').do(function(containsTable) {
      return r.branch(
        containsTable,
        {created: 0},
        r.tableCreate('users', {primary_key: 'email'})
      );
    }).run(connection, function(err) {
      callback(err, connection);
    });
  },
  //TODO Create Index if require
], function(err, connection) {
  if(connection){
    logger.debug("Connected to RethinkDB and set to router");
    express.db = connection;
  }
});
