var sinon = require('sinon');
var MongoDBDriver = require('./../../../lib/repositories/MongoDB');
var errorCodes = require('./../../../lib/errorCodes');

describe('Repositories, MongoDB: FindOne', function() {
  var sandbox;

  beforeEach(function() {
    sandbox = sinon.sandbox.create();
  });

  afterEach(function() {
    sandbox.restore();
  });

  it('FindOne with no error', function(done) {
    var driver = new MongoDBDriver({
      'collectionName': 'coll_name'
    });
    var q = {_id: 1};
    var p = {name: 1};
    var o = {};
    var e = null;
    var r = {'result' : 1};

    driver.getCollection = function() {
      return {
        findOne: function(query, projection, options, cb) {
          query.should.be.eql(q);
          projection.should.be.eql(p);
          options.should.be.eql(o);
          cb(e, r);
        }
      };
    };

    driver.mongoDbFindOne(q, p, o)
        .then(function(result) {
          result.should.be.eql(r);
          done();
        });
  });

  it('FindOne with error', function(done) {
    var driver = new MongoDBDriver({
      'collectionName': 'coll_name'
    });
    var q = {_id: 1};
    var p = {name: 1};
    var o = {};
    var e = 'error';
    var r = {'result' : 1};

    driver.getCollection = function() {
      return {
        findOne: function(query, projection, options, cb) {
          query.should.be.eql(q);
          projection.should.be.eql(p);
          options.should.be.eql(o);
          cb(e, r);
        }
      };
    };

    driver.mongoDbFindOne(q, p, o)
        .then(function(result) {
          done('should thrown an error');
        }).catch(function(err) {
          err.code.should.be.equal(errorCodes.REPOSITORY_OPERATION_ERROR);
          err.parentError.should.be.equal(e);
          done();
        });
  });
});
