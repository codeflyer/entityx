require('should');
var MongoDBSequence = require('./../../lib/repositories/MongoDBSequence');
var MongoClient = require('mongodb').MongoClient;
var connectionManager = require('../../lib/services/ConnectionManager');

describe('Repositories, MongoDBSequence: loadEntity', function() {

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

  it('Load with promise', function(done) {
    var driver = new MongoDBSequence({'collectionName': 'test_driver_ts'}, 1);
    driver.loadEntity().then(
        function(doc) {
          doc._id.should.be.equal(1);
          done();
        }
    )
  });

  it('Load with promise not initialized', function(done) {
    var driver = new MongoDBSequence({'collectionName': 'test_driver_ts'});
    driver.loadEntity().then(
        function(doc) {
          done('error');
        }
    ).catch(function(err) {
          err.should.be.equal('Driver not initialized');
          done()
        })
  });

  it('Load with callback', function(done) {
    var driver = new MongoDBSequence({'collectionName': 'test_driver_ts'}, 1);
    driver.loadEntity(
        function(err, doc) {
          doc._id.should.be.equal(1);
          done();
        }
    )
  });

  it('Load with callback not initialized', function(done) {
    var driver = new MongoDBSequence({'collectionName': 'test_driver_ts'});
    driver.loadEntity(
        function(err, doc) {
          err.should.be.equal('Driver not initialized');
          done();
        }
    )
  });
});
