var sinon = require('sinon');
var MongoDBDriver = require('./../../../lib/repositories/MongoDB');
var errorCodes = require('./../../../lib/errorCodes');

describe('Repositories, MongoDB: findAndModify', function() {
  var sandbox;

  beforeEach(function() {
    sandbox = sinon.sandbox.create();
  });

  afterEach(function() {
    sandbox.restore();
  });

  it('Find and modify with no error', function(done) {
    var driver = new MongoDBDriver({
      'collectionName': 'coll_name'
    });
    var q = {_id: 1};
    var s = {name: 1};
    var u = {$set: {name: 'hello'}};
    var o = {};
    var e = null;
    var d = {'doc' : 'a'};
    var r = {'result' : 1};

    driver.getCollection = function() {
      return {
        findAndModify: function(query, sort, update, options, cb) {
          query.should.be.eql(q);
          sort.should.be.eql(s);
          update.should.be.eql(u);
          options.should.be.eql(o);
          cb(e, d, r);
        }
      };
    };

    driver.mongoDbFindAndModify(q, s, u, o)
        .then(function(result) {
          result.should.be.eql(r);
          done();
        });
  });

  it('Find and modify with error', function(done) {
    var driver = new MongoDBDriver({
      'collectionName': 'coll_name'
    });
    var q = {_id: 1};
    var s = {name: 1};
    var u = {$set: {name: 'hello'}};
    var o = {};
    var e = 'error';
    var d = {'doc' : 'a'};
    var r = {'result' : 1};

    driver.getCollection = function() {
      return {
        findAndModify: function(query, sort, update, options, cb) {
          query.should.be.eql(q);
          sort.should.be.eql(s);
          update.should.be.eql(u);
          options.should.be.eql(o);
          cb(e, d, r);
        }
      };
    };

    driver.mongoDbFindAndModify(q, s, u, o)
        .then(function(result) {
          done('should thrown an error');
        }).catch(function(err) {
          err.code.should.be.equal(errorCodes.REPOSITORY_OPERATION_ERROR);
          err.parentError.should.be.equal(e);
          done();
        });
  });
});
