var sinon = require('sinon');
var connectionManager = require('connection-store');
var MongoDBDriver = require('./../../../lib/repositories/MongoDB');

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
      'collectionName': 'coll_name'
    });

    var getConnectionStub = sandbox.stub(connectionManager, 'getConnection');
    driver.getConnection();
    getConnectionStub.calledOnce.should.be.true;
    getConnectionStub.calledWith().should.be.true;
  });

  it('Get default connection', function() {
    var driver = new MongoDBDriver({
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
