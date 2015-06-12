var assert = require('assert');
var httpreq = require('httpreq');
var should = require('should');
var session = '';

describe("User", function(){
  before(function(done){
    done();
  });
  describe("create", function(){
    it("new user", function(done){
      httpreq.post('http://localhost:3000/users/create',
        {
          parameters: {
            email: 'abc@gmail.com',
            fullName: 'test',
            password: 'test'
          }
        },function(err, res){
          res.statusCode.should.be.exactly(200);
          ret = JSON.parse(res.body);
          ret.errno.should.be.exactly(0);
          done();
        }
      );
    }),
    it("exist user", function(done){
      httpreq.post('http://localhost:3000/users/create',
        {
          parameters: {
            email: 'abc@gmail.com',
            fullName: 'test',
            password: 'test'
          }
        },function(err, res){
          res.statusCode.should.be.exactly(200);
          ret = JSON.parse(res.body);
          ret.errno.should.be.exactly(1001);
          done();
        }
      );
    })
  }),
  describe("login", function(){
    it("with correct password", function(done){
      var digest = require('http-digest-client')('abc@gmail.com', 'test');
      digest.request({
        host: 'localhost',
        path: '/login',
        port: 3000,
        method: 'POST',
        headers: { "User-Agent": "Simon Ljungberg" } // Set any headers you want
      }, function (res) {
        res.on('data', function (data) {
        });
        res.on('end', function(){
          res.statusCode.should.be.exactly(200);
          should.exist(res.headers['set-cookie']);
          var str = res.headers['set-cookie'][0];
          var a = str.split(';');
          session = a[0];
          done();
        });
        res.on('error', function (err) {
        });
      });
    }),
    it("with incorrect password", function(done){
      var digest = require('http-digest-client')('abc@gmail.com', 'test1');
      digest.request({
        host: 'localhost',
        path: '/login',
        port: 3000,
        method: 'POST',
        headers: { "User-Agent": "Simon Ljungberg" } // Set any headers you want
      }, function (res) {
        res.on('data', function (data) {
        });
        res.on('end', function(){
          res.statusCode.should.be.exactly(401);
          done();
        });
        res.on('error', function (err) {
        });
      });
    }),
    it("with non-exist user", function(done){
      var digest = require('http-digest-client')('def@gmail.com', 'test1');
      digest.request({
        host: 'localhost',
        path: '/login',
        port: 3000,
        method: 'POST',
        headers: { "User-Agent": "Simon Ljungberg" } // Set any headers you want
      }, function (res) {
        res.on('data', function (data) {
        });
        res.on('end', function(){
          res.statusCode.should.be.exactly(401);
          done();
        });
        res.on('error', function (err) {
        });
      });
    }),
    it("with correct session", function(done){
      var c = [];
      httpreq.get('http://localhost:3000/validate',
        {
          cookies: [session]
        },function(err, res){
          res.statusCode.should.be.exactly(200);
          done();
        }
      );
    }),
    it("with incorrect session", function(done){
      var c = [];
      httpreq.get('http://localhost:3000/validate',
        {
          cookies: ["test=test"]
        },function(err, res){
          res.statusCode.should.be.exactly(401);
          done();
        }
      );
    })
  })
});
