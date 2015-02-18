var Promise = require('bluebird');
var ErrorX = require('codeflyer-errorx');
var MongoClient = require('mongodb').MongoClient;
var connectionManager = require('connection-store');

var InheritDriver =
    require('./../../classesTest/lib/repositories/InheritDriver');
var InheritNoTsDriver =
    require('./../../classesTest/lib/repositories/InheritNoTsDriver');
var errorCodes = require('../../../lib/errorCodes');

describe('Repositories, MongoDBAbstract AddValueToCollection', function() {
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

  it('Update no initialized', function(done) {
    var driver = new InheritNoTsDriver();
    driver.addValueToCollection().then(function() {
      done('should thrown an error');
    }).catch(function(err) {
          err.code.should.be.equal(errorCodes.REPOSITORY_NOT_INIT);
          done();
        }
    );
  });

  it('Add value to list', function(done) {
    var driver = new InheritDriver(1);
    var key = 'someKey';
    var data = {'name' : 'hello'};
    var doc = {'val' : 'someVal'};
    driver.addTimestampUpdateValue = function(dataParam) {
      dataParam.should.be.eql({});
    };

    driver.mongoDbUpdate = function(query, update, options) {
      query.should.be.eql({_id: 1});

      update.should.be.eql({
        $push : {
          'someKey' : data
        },
        $set : {}
      });
      (options == null).should.be.true;
      return Promise.resolve(doc);
    };

    driver.addValueToCollection(key, data).then(function(result) {
      result.should.be.true;
      done();
    }).catch(function(err) {
          done(err);
        }
    );
  });

  it('Add value to list with current', function(done) {
    var driver = new InheritDriver(1);
    var key = 'someKey';
    var current = 'anotherKey';
    var data = {'name' : 'hello'};
    var doc = {'val' : 'someVal'};
    driver.addTimestampUpdateValue = function(dataParam) {
      dataParam.should.be.eql({});
    };

    driver.mongoDbUpdate = function(query, update, options) {
      query.should.be.eql({_id: 1});

      update.should.be.eql({
        $push : {
          'someKey' : data
        },
        $set : {
          'anotherKey' : data
        }
      });
      (options == null).should.be.true;
      return Promise.resolve(doc);
    };

    driver.addValueToCollection(key, data, current).then(function(result) {
      result.should.be.true;
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
      return Promise.reject(
          new ErrorX(errorCodes.REPOSITORY_OPERATION_ERROR, 'ERROR'));
    };

    driver.addValueToCollection(data).then(function() {
      done('should thrown an error');
    }).catch(function(err) {
          err.code.should.be.equal(errorCodes.REPOSITORY_OPERATION_ERROR);
          err.parentError.message.should.be.equal('ERROR');
          done();
        }
    );
  });
});
