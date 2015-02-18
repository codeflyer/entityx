var MongoClient = require('mongodb').MongoClient;
var connectionManager = require('connection-store');

var InheritDriver =
    require('./../../classesTest/lib/repositories/InheritDriver');
var InheritFlatDriver =
    require('./../../classesTest/lib/repositories/InheritFlatDriver');
var InheritNoTsDriver =
    require('./../../classesTest/lib/repositories/InheritNoTsDriver');

describe('Repositories, MongoDBAbstract Timestamp', function() {
  var fixtures;
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
      fixtures.load(__dirname + './../../fixtures/driverNoTs.js', function() {
        fixtures.load(__dirname + './../../fixtures/driverTs.js', done);
      });
    });
  });

  it('Timestamp filter NO TS', function() {
    var driver = new InheritNoTsDriver(1);
    var data = {'name' : 'hello'};
    driver.addTimestampFilter(data);
    (data._deleted === undefined).should.be.true;
    (data['_ts.deleted'] === undefined).should.be.true;
  });

  it('Timestamp filter TS', function() {
    var driver = new InheritDriver(1);
    var data = {'name' : 'hello'};
    driver.addTimestampFilter(data);
    (data['_ts.deleted'] === null).should.be.true;
  });

  it('Timestamp filter TS flat', function() {
    var driver = new InheritFlatDriver(1);
    var data = {'name' : 'hello'};
    driver.addTimestampFilter(data);
    (data._deleted === null).should.be.true;
  });

  it('addTimestampUpdateValue filter NO TS', function() {
    var driver = new InheritNoTsDriver(1);
    var data = {'name' : 'hello'};
    driver.addTimestampUpdateValue(data);
    (data._modified === undefined).should.be.true;
    (data['_ts.modified'] === undefined).should.be.true;
  });

  it('addTimestampUpdateValue filter TS', function() {
    var driver = new InheritDriver(1);
    var data = {'name' : 'hello'};
    driver.addTimestampUpdateValue(data);
    (typeof data['_ts.modified'] === 'object').should.be.true;
  });

  it('addTimestampUpdateValue filter TS flat', function() {
    var driver = new InheritFlatDriver(1);
    var data = {'name' : 'hello'};
    driver.addTimestampUpdateValue(data);
    (typeof data._modified === 'object').should.be.true;
  });

  it('addTimestampInsertValue filter NO TS', function() {
    var driver = new InheritNoTsDriver(1);
    var data = {'name' : 'hello'};
    driver.addTimestampInsertValue(data);
    (data._created === undefined).should.be.true;
    (data._modified === undefined).should.be.true;
    (data._deleted === undefined).should.be.true;

    (data._ts === undefined).should.be.true;
  });

  it('addTimestampInsertValue filter TS', function() {
    var driver = new InheritDriver(1);
    var data = {'name' : 'hello'};
    driver.addTimestampInsertValue(data);
    (typeof data._ts.created === 'object').should.be.true;
    (typeof data._ts.modified === 'object').should.be.true;
    (data._ts.deleted === null).should.be.true;
  });

  it('addTimestampInsertValue filter TS flat', function() {
    var driver = new InheritFlatDriver(1);
    var data = {'name' : 'hello'};
    driver.addTimestampInsertValue(data);
    (typeof data._created === 'object').should.be.true;
    (typeof data._modified === 'object').should.be.true;
    (data._deleted === null).should.be.true;
  });
});
