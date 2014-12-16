var sinon = require('sinon');
var MongoDBDriver = require('./../../../lib/repositories/MongoDB');
var connectionManager = require('../../../lib/services/ConnectionManager');

describe('Repositories, MongoDB: getCollection', function() {
  var sandbox;

  beforeEach(function() {
    sandbox = sinon.sandbox.create();
  });

  afterEach(function() {
    sandbox.restore();
  });

  it('Get default collection', function() {
    var driver = new MongoDBDriver({
      'collectionName': 'coll_name'
    });
    var getConnectionStub = sandbox.stub(connectionManager, 'getConnection');
    var collection = function(value) {
      value.should.be.equal('coll_name');
    };
    getConnectionStub.returns(
        {
          collection: collection
        }
    );
    driver.getCollection();
  });

  it('Get named collection', function() {
    var driver = new MongoDBDriver({
      'collectionName': 'coll_name'
    });
    var getConnectionStub = sandbox.stub(connectionManager, 'getConnection');
    var collection = function(value) {
      value.should.be.equal('hello');
    };
    getConnectionStub.returns(
        {
          collection: collection
        }
    );
    driver.getCollection('hello');
  });
});
