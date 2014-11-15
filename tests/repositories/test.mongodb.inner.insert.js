require('should');
var MongoDBSequence = require('./../../lib/repositories/MongoDBSequence');
var MongoDBInner = require('./../../lib/repositories/MongoDBInner');
var MongoClient = require('mongodb').MongoClient;
var connectionManager = require('../../lib/services/ConnectionManager');

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
    driver.insert({'test': 'foo'}, function(err, doc) {

      var innerDriver = new MongoDBInner({
        'collectionName': 'coll_name',
        'innerFieldName': 'list'
      }, null);
      innerDriver.insert(2, {'val': 'bar'}, function(err, doc) {
        connection.collection('coll_name')
            .findOne({'_id': 2}, function(err, doc) {
              doc.list.should.be.eql([{'_id': 2, 'val': 'bar'}]);
              done();
            });
      });
    });
  });

  it('Insert new with timestamp', function(done) {
    var driver = new MongoDBSequence({
      'collectionName': 'coll_name',
      'useTimestamp': true
    }, null);
    driver.insert({'test': 'foo'}, function(err, doc) {
      doc._id.should.be.equal(2);
      doc.test.should.be.equal('foo');
      doc._ts.created.should.exists;
      doc._ts.modified.should.exists;
      (doc._ts.deleted == null).should.be.true;
      done();
    });
  });

  it('Double Insert', function(done) {
    var driver = new MongoDBSequence({'collectionName': 'coll_name'}, null);
    driver.insert({'test': 'foo'}, function(err, doc) {
      doc._id.should.be.equal(2);
      doc.test.should.be.equal('foo');
      driver.insert({'test': 'foo2'}, function(err, doc) {
        doc._id.should.be.equal(3);
        doc.test.should.be.equal('foo2');
        done();
      });
    });
  });
});
