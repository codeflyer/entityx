require('should');
var Promise = require('bluebird');
var MongoDB = require('./../../lib/repositories/MongoDB');
var MongoClient = require('mongodb').MongoClient;
var connectionManager = require('../../lib/services/ConnectionManager');

describe('Repositories, MongoDB: loadBy', function() {

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

  it('Load with query initialized', function(done) {
    var driver = new MongoDB({'collectionName': 'test_driver_ts'});
    var query = {'_id' : 1};
    var projection = {};
    driver.loadBy(query, projection).then(
        function(docs) {
          docs.should.be.instanceof(Array);
          docs[0]._id.should.be.equal(1);
          done();
        }
    );
  });

  it('Load with query initialized but with empty result', function(done) {
    var driver = new MongoDB({'collectionName': 'test_driver_ts'});
    var query = {'test' : 'testtest'};
    var projection = {};
    driver.loadBy(query, projection).then(
        function(docs) {
          docs.should.be.instanceof(Array).and.have.lengthOf(0);
          done();
        }
    );
  });

  it('Load with query and projection not set', function(done) {
    var driver = new MongoDB({'collectionName': 'test_driver_ts'});
    driver.loadBy().then(
        function(docs) {
          docs.should.be.instanceof(Array);
          docs[0]._id.should.be.equal(1);
          done();
        }
    );
  });

  it('Load with mongodb Error', function(done) {
    var driver = new MongoDB({'collectionName': 'test_driver_ts'});
    driver.mongoDbFindToArray = function(query) {
      return Promise.reject('my-err');
    };
    driver.loadBy().then(
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
