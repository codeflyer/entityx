var Promise = require('bluebird');
var ErrorX = require('codeflyer-errorx');
var InheritDriver =
    require('./../../classesTest/lib/repositories/InheritDriver');
var InheritNoTsDriver =
    require('./../../classesTest/lib/repositories/InheritNoTsDriver');
var MongoClient = require('mongodb').MongoClient;
var connectionManager = require('../../../lib/services/ConnectionManager');
var errorCodes = require('../../../lib/errorCodes');

describe('REpositories, MongoDBAbstract Exists', function() {
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

  it('Test exists Ts', function(done) {
    var driver = new InheritDriver(1);
    driver.exists().then(function(exists) {
      exists.should.be.true;
      done();
    }).catch(function(err) {
          done(err);
        }
    );
  });

  it('Test not exists Ts (removed)', function(done) {
    var driver = new InheritDriver(3);
    driver.exists().then(function(exists) {
      exists.should.be.false;
      done();
    }).catch(function(err) {
          done(err);
        }
    );
  });

  it('Test not exists Ts (never existed)', function(done) {
    var driver = new InheritDriver(4);
    driver.exists().then(function(exists) {
      exists.should.be.false;
      done();
    }).catch(function(err) {
          done(err);
        }
    );
  });

  it('Test exists NoTs', function(done) {
    var driver = new InheritNoTsDriver(1);
    driver.exists().then(function(exists) {
      exists.should.be.true;
      done();
    }).catch(function(err) {
          done(err);
        }
    );
  });

  it('Test not exists No Ts (never existed)', function(done) {
    var driver = new InheritNoTsDriver(4);
    driver.exists().then(function(exists) {
      exists.should.be.false;
      done();
    }).catch(function(err) {
          done(err);
        }
    );
  });

  it('Test with error', function(done) {
    var driver = new InheritNoTsDriver(4);
    driver.mongoDbFindOne = function() {
      return Promise.reject(
          new ErrorX(errorCodes.REPOSITORY_OPERATION_ERROR, 'ERROR'));
    };

    driver.exists().then(function(exists) {
      done('should thrown an error');
    }).catch(function(err) {
          err.code.should.be.equal(errorCodes.REPOSITORY_OPERATION_ERROR);
          err.parentError.message.should.be.equal('ERROR');
          done();
        }
    );
  });
});
