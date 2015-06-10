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

  });
});
