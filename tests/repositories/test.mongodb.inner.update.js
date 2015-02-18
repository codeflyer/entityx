var MongoClient = require('mongodb').MongoClient;
var connectionManager = require('connection-store');
var MongoDBSequence = require('./../../lib/repositories/MongoDBSequence');
var MongoDBInner = require('./../../lib/repositories/MongoDBInner');


describe('Repositories, MongoDBInner: Update', function() {

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
      fixtures.load(__dirname + './../fixtures/onlySequence.js', done);
    });
  });

  it('Insert new', function(done) {
    var driver = new MongoDBSequence({'collectionName': 'coll_name'}, null);
    driver.insert({'test': 'foo'}).then(
        function(doc) {
          var innerDriver = new MongoDBInner({
            'collectionName': 'coll_name',
            'innerFieldName': 'list'
          }, null);
          return innerDriver.insert(2, {'val': 'bar'});
        }
    ).then(function(doc) {
          var innerUpdateDriver = new MongoDBInner({
            'collectionName': 'coll_name',
            'innerFieldName': 'list'
          }, 2);
          return innerUpdateDriver.update({'val': 'gon'});
        }
    ).then(function() {
          connection.collection('coll_name').findOne(
              {'_id': 2}, function(err, doc) {
                doc.list.should.be.eql([
                  {'_id': 2, 'val': 'gon'}
                ]);
                done();
              });
        });
  });
});
