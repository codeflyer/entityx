var MongoDBInner = require('./../../lib/repositories/MongoDBInner');
var MongoClient = require('mongodb').MongoClient;
var connectionManager = require('../../lib/services/ConnectionManager');

describe('Repositories, MongoDBInner: Load details', function() {

  var connection;
  before(function(done) {
    var dbName = 'entityxTest';
    fixtures = require('pow-mongodb-fixtures').connect(dbName);
    MongoClient.connect('mongodb://localhost/' + dbName, function(err, db) {
      if (err) {
        throw err;
      }
      connection = db;
      connectionManager.addConnection(db);
      done();
    });
  });

  beforeEach(function(done) {
    fixtures.clear(function() {
      fixtures.load(__dirname + './../fixtures/driverInner.js', done);
    });
  });

  it('Load details', function(done) {
    var innerDriver = new MongoDBInner({
      'collectionName': 'test_driver_inner',
      'innerFieldName': 'list'
    }, 2);
    innerDriver.loadEntity().then(function(doc) {
          done();
        }
    ).catch(function(err) {
          done(err);
        });
  });
});
