require('should');
var InheritDriver = require('./../classesTest/lib/repositories/InheritDriver');
var InheritNoTsDriver =
    require('./../classesTest/lib/repositories/InheritNoTsDriver');
var MongoClient = require('mongodb').MongoClient;
var connectionManager = require('../../lib/services/ConnectionManager');
var Q = require('q');

describe('Driver operation: Delete', function() {
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
      fixtures.load(__dirname + './../fixtures/driverNoTs.js', function() {
        fixtures.load(__dirname + './../fixtures/driverTs.js', done);
      });
    });
  });

  it('Test delete noTS', function(done) {
    var driver = new InheritNoTsDriver(1);
    Q.ninvoke(driver, 'exists').then(
        function(result) {
          result.should.be.true;
          /* jshint newcap:false */
          return Q();
        }
    ).then(function() {
          var driver = new InheritNoTsDriver(1);
          return Q.ninvoke(driver, 'delete');
        }
    ).then(function() {
          var driver = new InheritNoTsDriver(1);
          return Q.ninvoke(driver, 'exists');
        }
    ).then(function(result) {
          result.should.be.false;
          var driver = new InheritNoTsDriver(1);
          return Q.ninvoke(
              driver
                  .getCollection(driver.collectionName), 'findOne', {'_id': 1});
        }
    ).then(function(result) {
          (result == null).should.be.true;
          done();
        });
  });

  it('Test delete TS', function(done) {

    var driver = new InheritDriver(1);
    Q.ninvoke(driver, 'exists').then(
        function(result) {
          result.should.be.true;
          /* jshint newcap:false */
          return Q();
        }
    ).then(function() {
          var driver = new InheritDriver(1);
          return Q.ninvoke(driver, 'delete', true);
        }
    ).then(function() {
          var driver = new InheritDriver(1);
          return Q.ninvoke(driver, 'exists');
        }
    ).then(function(result) {
          result.should.be.false;
          var driver = new InheritDriver(1);
          return Q.ninvoke(
              driver
                  .getCollection(driver.collectionName), 'findOne', {'_id': 1});
        }
    ).then(
        function(result) {
          (result == null).should.be.true;
          done();
        }
    ).catch(function(err) {
          done(err);
        });

  });
});
