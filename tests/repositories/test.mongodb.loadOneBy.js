require('should');
var Promise = require('bluebird');
var MongoDB = require('./../../lib/repositories/MongoDB');
var MongoClient = require('mongodb').MongoClient;
var connectionManager = require('../../lib/services/ConnectionManager');

describe('Repositories, MongoDB: loadOneBy', function() {

  before(function(done) {
    var dbName = 'entityxTest';
    fixtures = require('pow-mongodb-fixtures').connect(dbName);
    MongoClient.connect('mongodb://localhost/' + dbName, function(err, db) {
      if (err) {
        throw err;
      }
      connectionManager.addConnection(db);
      done();
    });
  });

  beforeEach(function(done) {
    fixtures.clear(function() {
      fixtures.load(__dirname + './../fixtures/driverTs.js', done);
    });
  });

  it('Load with id initialized', function(done) {
    var driver = new MongoDB({'collectionName': 'test_driver_ts'});
    var query = {'_id' : 1};
    var projection = {};
    driver.loadOneBy(query, projection).then(
        function(doc) {
          doc._id.should.be.equal(1);
          done();
        }
    );
  });

  it('Load with id not set', function(done) {
    var driver = new MongoDB({'collectionName': 'test_driver_ts'});
    driver.loadEntity().then(
        function(doc) {
          done('error');
        }
    ).catch(function(err) {
          err.code.should.be.equal(412);
          done();
        });
  });

  it('Load with mongodb Error', function(done) {
    var driver = new MongoDB({'collectionName': 'test_driver_ts'});
    driver.setId(1);
    driver.mongoDbFindOne = function(query) {
      return Promise.reject('my-err');
    };
    driver.loadEntity().then(
        function(doc) {
          done('error');
        }
    ).catch(function(err) {
          err.code.should.be.equal(500);
          err.message.should.be.equal('MongoDb error');
          err.parentError.should.be.equal('my-err');
          done();
        });
  });
});
