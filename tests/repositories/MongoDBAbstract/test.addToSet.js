var Promise = require('bluebird');
var ErrorX = require('codeflyer-errorx');
var MongoClient = require('mongodb').MongoClient;
var connectionManager = require('connection-store');

var InheritDriver =
    require('./../../classesTest/lib/repositories/InheritDriver');
var InheritNoTsDriver =
    require('./../../classesTest/lib/repositories/InheritNoTsDriver');
var errorCodes = require('../../../lib/errorCodes');

describe('Repositories, MongoDBAbstract addToSet', function() {
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
    connectionManager.getConnection().dropDatabase(function() {
      fixtures.load(__dirname + './../../fixtures/driverNoTs.js', function() {
        fixtures.load(__dirname + './../../fixtures/driverTs.js', done);
      });
    });
  });

  it('not initialized', function(done) {
    var driver = new InheritNoTsDriver();
    driver.addToSet().then(function() {
      done('should thrown an error');
    }).catch(function(err) {
          err.code.should.be.equal(errorCodes.REPOSITORY_NOT_INIT);
          done();
        }
    );
  });

  it('add value to set', function(done) {
    var driver = new InheritDriver(1);
    driver.addTimestampUpdateValue = function(dataParam) {
      dataParam.should.be.eql({});
    };

    driver.mongoDbUpdate = function(query, update, options) {
      query.should.be.eql({_id: 1});
      update.$addToSet.should.be.eql({list: 'hello'});
      (options == null).should.be.true;
      return Promise.resolve();
    };

    var value = 'hello';
    driver.addToSet('list', value).then(function(result) {
      result.should.be.true;
      done();
    }).catch(function(err) {
          done(err);
        }
    );
  });

  it('add value to set with ts', function(done) {
    var driver = new InheritDriver(1);
    var value = 'hello';
    var modifiedDate = new Date();

    driver.addTimestampUpdateValue = function(dataParam) {
      dataParam.should.be.eql({});
      dataParam['_ts.modified'] = modifiedDate;
    };

    driver.mongoDbUpdate = function(query, update, options) {
      query.should.be.eql({_id: 1});
      update.$addToSet.should.be.eql({list: 'hello'});
      update.$set['_ts.modified'].should.be.eql(modifiedDate);
      (options == null).should.be.true;
      return Promise.resolve();
    };

    driver.addToSet('list', value).then(function(result) {
      result.should.be.true;
      done();
    }).catch(function(err) {
          done(err);
        }
    );
  });

  it('addValue value with error', function(done) {
    var driver = new InheritDriver(1);
    var value = 'hello';
    var modifiedDate = new Date();
    driver.addTimestampUpdateValue = function(dataParam) {
      dataParam.should.be.eql({});
      dataParam['_ts.modified'] = modifiedDate;
    };

    driver.mongoDbUpdate = function(query, update, options) {
      query.should.be.eql({_id: 1});
      update.$addToSet.should.be.eql({list: 'hello'});
      update.$set['_ts.modified'].should.be.eql(modifiedDate);
      (options == null).should.be.true;
      return Promise.reject(
          new ErrorX(errorCodes.REPOSITORY_OPERATION_ERROR, 'ERROR'));
    };

    driver.addToSet('list', value).then(function(result) {
      done('should thrown an error');
    }).catch(function(err) {
          err.code.should.be.equal(errorCodes.REPOSITORY_OPERATION_ERROR);
          err.parentError.message.should.be.equal('ERROR');
          done();
        }
    );
  });
});
