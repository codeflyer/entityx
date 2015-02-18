var connectionManager = require('connection-store');
var MongoClient = require('mongodb').MongoClient;
var MongoDBSequence = require('./../../lib/repositories/MongoDBSequence');
var MongoDBInner = require('./../../lib/repositories/MongoDBInner');
var q = require('q');
describe('Repositories, MongoDBInner: Insert', function() {

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
    ).then(function() {
          return q.ninvoke(driver.getCollection(), 'findOne', {'_id': 2});
        }
    ).then(
        function(doc) {
          doc.list.should.be.eql([{'_id': 2, 'val': 'bar'}]);
          done();
        });
  });

  it('Insert new with timestamp', function(done) {
    var driver = new MongoDBSequence({
      'collectionName': 'coll_name',
      'useTimestamp': true
    }, null);
    driver.insert({'test': 'foo'}).then(
        function(doc) {
          doc._id.should.be.equal(2);
          doc.test.should.be.equal('foo');
          doc._ts.created.should.exists;
          doc._ts.modified.should.exists;
          (doc._ts.deleted == null).should.be.true;
          done();
        }).catch(function(err) {
          done(err);
        });
  });

  it('Double Insert', function(done) {
    var driver = new MongoDBSequence({'collectionName': 'coll_name'}, null);
    driver.insert({'test': 'foo'}).then(
        function(doc) {
          doc._id.should.be.equal(2);
          doc.test.should.be.equal('foo');
          return driver.insert({'test': 'foo2'});
        }
    ).then(function(doc) {
          doc._id.should.be.equal(3);
          doc.test.should.be.equal('foo2');
          done();
        }).catch(function(err) {
          done(err);
        });
  });
});
