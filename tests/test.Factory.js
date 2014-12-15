var Factory = require('../lib/Factory');
var path = require('path');
var MongoClient = require('mongodb').MongoClient;
var connectionManager = require('../lib/services/ConnectionManager');

describe('Factory', function() {
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
    Factory._reset();
    Factory.reset();
    fixtures.clear(function(err) {
      fixtures.load(path.join(__dirname, './fixtures/users.js'), done);
    });
  });
});
