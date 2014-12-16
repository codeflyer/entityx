var sinon = require('sinon');
var MongoDBDriver = require('./../../../lib/repositories/MongoDB');
var errorCodes = require('./../../../lib/errorCodes');

describe('Repositories, MongoDB: insert', function() {
  var sandbox;

  beforeEach(function() {
    sandbox = sinon.sandbox.create();
  });

  afterEach(function() {
    sandbox.restore();
  });

  it('Insert with no error', function(done) {
    var driver = new MongoDBDriver({
      'collectionName': 'coll_name'
    });
    var q = {_id: 1};
    var e = null;
    var r = {'result' : 1};

    driver.getCollection = function() {
      return {
        insert: function(data, cb) {
          data.should.be.eql(q);
          cb(e, r);
        }
      };
    };

    driver.mongoDbInsert(q)
        .then(function(result) {
          result.should.be.eql(r);
          done();
        });
  });

  it('Insert with error', function(done) {
    var driver = new MongoDBDriver({
      'collectionName': 'coll_name'
    });
    var q = {_id: 1};
    var e = 'error';
    var r = {'result' : 1};

    driver.getCollection = function() {
      return {
        insert: function(data, cb) {
          data.should.be.eql(q);
          cb(e, r);
        }
      };
    };

    driver.mongoDbInsert(q)
        .then(function(result) {
          done('should thrown an error');
        }).catch(function(err) {
          err.code.should.be.equal(errorCodes.REPOSITORY_OPERATION_ERROR);
          err.parentError.should.be.equal(e);
          done();
        });
  });
});
