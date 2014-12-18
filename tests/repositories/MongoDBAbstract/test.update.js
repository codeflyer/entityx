var Promise = require('bluebird');
var ErrorX = require('codeflyer-errorx');

var InheritDriver =
    require('./../../classesTest/lib/repositories/InheritDriver');
var InheritNoTsDriver =
    require('./../../classesTest/lib/repositories/InheritNoTsDriver');
var MongoClient = require('mongodb').MongoClient;
var connectionManager = require('../../../lib/services/ConnectionManager');
var errorCodes = require('../../../lib/errorCodes');

describe('Repositories, MongoDBAbstract Update', function() {
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

  it('Update no initialized', function(done) {
    var driver = new InheritNoTsDriver();
    driver.update().then(function() {
      done('should thrown an error');
    }).catch(function(err) {
          err.code.should.be.equal(errorCodes.REPOSITORY_NOT_INIT);
          done();
        }
    );
  });

  it('Update value', function(done) {
    var driver = new InheritDriver(1);
    var data = {'name' : 'hello'};
    var doc = {'val' : 'someVal'};
    driver.addTimestampUpdateValue = function(dataParam) {
      dataParam.should.be.eql(data);
    };

    driver.mongoDbUpdate = function(query, update, options) {
      query.should.be.eql({_id: 1});
      update.$set.name.should.be.equal('hello');
      (options == null).should.be.true;
      return Promise.resolve(doc);
    };

    driver.update(data).then(function(result) {
      result.should.be.eql(doc);
      done();
    }).catch(function(err) {
          done(err);
        }
    );
  });

  it('Update value with error', function(done) {
    var driver = new InheritDriver(1);
    var data = {'name' : 'hello'};
    driver.mongoDbUpdate = function(query, update, options) {
      query.should.be.eql({_id: 1});
      (typeof update.$set['_ts.modified']).should.be.equal('object');
      update.$set.name.should.be.equal('hello');
      (options == null).should.be.true;
      return Promise.reject(
          new ErrorX(errorCodes.REPOSITORY_OPERATION_ERROR, 'ERROR'));
    };

    driver.update(data).then(function() {
      done('should thrown an error');
    }).catch(function(err) {
          err.code.should.be.equal(errorCodes.REPOSITORY_OPERATION_ERROR);
          err.parentError.message.should.be.equal('ERROR');
          done();
        }
    );
  });
});
