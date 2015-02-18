var Promise = require('bluebird');
var ErrorX = require('codeflyer-errorx');
var MongoClient = require('mongodb').MongoClient;
var connectionManager = require('connection-store');

var InheritDriver =
    require('./../../classesTest/lib/repositories/InheritDriver');
var InheritFlatDriver =
    require('./../../classesTest/lib/repositories/InheritFlatDriver');
var InheritNoTsDriver =
    require('./../../classesTest/lib/repositories/InheritNoTsDriver');
var errorCodes = require('../../../lib/errorCodes');

describe('Repositories, MongoDBAbstract Delete', function() {
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

  it('Test delete noTS NO MOCK', function(done) {
    var driver = new InheritNoTsDriver(1);
    driver.exists().then(
        function(result) {
          result.should.be.true;
          var driver = new InheritNoTsDriver(1);
          return driver.delete();
        }
    ).then(function() {
          var driver = new InheritNoTsDriver(1);
          return driver.exists();
        }
    ).then(function(result) {
          result.should.be.false;
          var driver = new InheritNoTsDriver(1);
          return driver.mongoDbFindOne({'_id': 1});
        }
    ).then(function(result) {
          (result == null).should.be.true;
          done();
        });
  });

  it('Delete no TS', function(done) {
    var driver = new InheritNoTsDriver(4);
    driver.mongoDbRemove = function(query, options) {
      query.should.be.eql({_id: 4});
      options.should.be.eql({w: 1});
      return Promise.resolve();
    };

    driver.mongoDbUpdate = function() {
      return Promise.reject('Should not pass from here');
    };

    driver.delete().then(function(result) {
      result.should.be.true;
      done();

    }).catch(function(err) {
          done(err);
        }
    );
  });

  it('Delete no initialized', function(done) {
    var driver = new InheritNoTsDriver();
    driver.delete().then(function() {
      done('should thrown an error');
    }).catch(function(err) {
          err.code.should.be.equal(errorCodes.REPOSITORY_NOT_INIT);
          done();
        }
    );
  });

  it('Delete no TS with error', function(done) {
    var driver = new InheritNoTsDriver(4);
    driver.mongoDbRemove = function(query, options) {
      query.should.be.eql({_id: 4});
      options.should.be.eql({w: 1});
      return Promise.reject(
          new ErrorX(errorCodes.REPOSITORY_OPERATION_ERROR, 'ERROR'));
    };

    driver.mongoDbUpdate = function() {
      return Promise.reject('Should not pass from here');
    };

    driver.delete().then(function() {
      done('should thrown an error');
    }).catch(function(err) {
          err.code.should.be.equal(errorCodes.REPOSITORY_OPERATION_ERROR);
          err.parentError.message.should.be.equal('ERROR');
          done();
        }
    );
  });

  it('Delete TS', function(done) {
    var driver = new InheritDriver(1);
    driver.mongoDbUpdate = function(query, update, options) {
      query.should.be.eql({_id: 1});
      (typeof update.$set['_ts.deleted']).should.be.equal('object');
      options.should.be.eql({w: 1});
      return Promise.resolve();
    };

    driver.mongoDbRemove = function() {
      return Promise.reject('Should not pass from here');
    };

    driver.delete().then(function(result) {
      result.should.be.true;
      done();
    }).catch(function(err) {
          done(err);
        }
    );
  });

  it('Delete TS Permanent', function(done) {
    var driver = new InheritDriver(1);
    driver.mongoDbRemove = function(query, options) {
      query.should.be.eql({_id: 1});
      options.should.be.eql({w: 1});
      return Promise.resolve();
    };

    driver.mongoDbUpdate = function() {
      return Promise.reject('Should not pass from here');
    };

    driver.delete(true).then(function(result) {
      result.should.be.true;
      done();
    }).catch(function(err) {
          done(err);
        }
    );
  });

  it('Delete TS with error', function(done) {
    var driver = new InheritDriver(1);
    driver.mongoDbUpdate = function(query, update, options) {
      query.should.be.eql({_id: 1});
      (typeof update.$set['_ts.deleted']).should.be.equal('object');
      options.should.be.eql({w: 1});
      return Promise.reject(
          new ErrorX(errorCodes.REPOSITORY_OPERATION_ERROR, 'ERROR'));
    };

    driver.mongoDbRemove = function() {
      return Promise.reject('Should not pass from here');
    };

    driver.delete().then(function(result) {
      done('should thrown an error');
    }).catch(function(err) {
          err.code.should.be.equal(errorCodes.REPOSITORY_OPERATION_ERROR);
          err.parentError.message.should.be.equal('ERROR');
          done();
        }
    );
  });

  it('Delete TS flat', function(done) {
    var driver = new InheritFlatDriver(1);
    driver.mongoDbUpdate = function(query, update, options) {
      query.should.be.eql({_id: 1});
      (typeof update.$set._deleted).should.be.equal('object');
      options.should.be.eql({w: 1});
      return Promise.resolve();
    };

    driver.mongoDbRemove = function() {
      return Promise.reject('Should not pass from here');
    };

    driver.delete().then(function(result) {
      result.should.be.true;
      done();
    }).catch(function(err) {
          done(err);
        }
    );
  });
});
