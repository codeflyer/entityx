var sinon = require('sinon');
var MongoDBDriver = require('./../../lib/repositories/MongoDB');
var connectionManager = require('../../lib/services/ConnectionManager');

describe('Repositories, MongoDB: getConnection', function() {
  var sandbox;

  beforeEach(function() {
    sandbox = sinon.sandbox.create();
  });

  afterEach(function() {
    sandbox.restore();
  });

  it('Get default connection', function() {
    var driver = new MongoDBDriver({
      'useTimestamp': true,
      'collectionName': 'coll_name'
    });

    var getConnectionStub = sandbox.stub(connectionManager, 'getConnection');
    getConnectionStub.returns(null);
    driver.getConnection();
    getConnectionStub.calledOnce.should.be.true;
    getConnectionStub.calledWith(undefined).should.be.true;
  });

  it('Get default connection', function() {
    var driver = new MongoDBDriver({
      'useTimestamp': true,
      'collectionName': 'coll_name',
      'connectionName': 'my-connection'
    });
    var getConnectionStub = sandbox.stub(connectionManager, 'getConnection');
    getConnectionStub.returns(null);
    driver.getConnection();
    getConnectionStub.calledOnce.should.be.true;
    getConnectionStub.calledWith('my-connection').should.be.true;
  });

});
