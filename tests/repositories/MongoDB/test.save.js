var sinon = require('sinon');
var MongoDBDriver = require('./../../../lib/repositories/MongoDB');
var errorCodes = require('./../../../lib/errorCodes');

describe('Repositories, MongoDB: save', function() {
  var sandbox;

  beforeEach(function() {
    sandbox = sinon.sandbox.create();
  });

  afterEach(function() {
    sandbox.restore();
  });

  it('Save with no error', function(done) {
    var driver = new MongoDBDriver({
      'collectionName': 'coll_name'
    });
    var q = {_id: 1};
    var e = null;
    var r = {'result' : 1};

    driver.getCollection = function() {
      return {
        save: function(data, cb) {
          data.should.be.eql(q);
          cb(e, r);
        }
      };
    };

    driver.mongoDbSave(q)
        .then(function(result) {
          result.should.be.eql(r);
          done();
        });
  });

  it('Save with error', function(done) {
    var driver = new MongoDBDriver({
      'collectionName': 'coll_name'
    });
    var q = {_id: 1};
    var e = 'error';
    var r = {'result' : 1};

    driver.getCollection = function() {
      return {
        save: function(data, cb) {
          data.should.be.eql(q);
          cb(e, r);
        }
      };
    };

    driver.mongoDbSave(q)
        .then(function(result) {
          done('should thrown an error');
        }).catch(function(err) {
          err.code.should.be.equal(errorCodes.REPOSITORY_OPERATION_ERROR);
          err.parentError.should.be.equal(e);
          done();
        });
  });
});
