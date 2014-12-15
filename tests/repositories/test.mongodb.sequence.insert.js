var MongoDBSequence = require('./../../lib/repositories/MongoDBSequence');
var MongoClient = require('mongodb').MongoClient;
var connectionManager = require('../../lib/services/ConnectionManager');

describe('Repositories, MongoDBSequence: Insert', function() {

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
      fixtures.load(__dirname + './../fixtures/onlySequence.js', done);
    });
  });

  it('Insert new', function(done) {
    var driver = new MongoDBSequence({'collectionName': 'coll_name'}, null);
    driver.insert({'test': 'foo'}).then(
        function(doc) {
          doc._id.should.be.equal(2);
          doc.test.should.be.equal('foo');
          (doc._ts == null).should.be.true;
          done();
        }
    ).catch(function(err) {
          done(err);
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
        }
    ).catch(function(err) {
          done(err);
        }
    );
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
        }
    );
  });
})
;
