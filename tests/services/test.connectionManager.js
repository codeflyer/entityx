require('should');
delete require.cache[require.resolve('./../../lib/services/ConnectionManager')];
var ConnectionManager = require('./../../lib/services/ConnectionManager');

describe('ConnectionManager', function() {
  beforeEach(function() {
    ConnectionManager.reset();
  });

  afterEach(function() {
    ConnectionManager.reset();
  });

  it('testReset', function() {
    ConnectionManager.addConnection('name', 'mockconnection');
    ConnectionManager.reset();
    ConnectionManager.getConnectionList().should.be.eql([]);
  });

  it('getConnectionList', function() {
    ConnectionManager.getConnectionList().should.be.eql([]);
  });

  it('Add connection', function() {
    ConnectionManager.addConnection('name', 'mockconnection');
    ConnectionManager.getConnectionList().should.be.eql(['name']);
  });

  it('Add default connection', function() {
    ConnectionManager.addConnection('mockconnection');
    ConnectionManager.getConnectionList().should.be.eql(['DEFAULT_CONNECTION']);
  });

  it('Get connection', function() {
    ConnectionManager.addConnection('tempConn', 'mockconnection');
    ConnectionManager.getConnection('tempConn')
        .should.be.equal('mockconnection');
  });

  it('Get connection not initialized', function() {
    (function() {
      ConnectionManager.getConnection('tmpConnection');
    }).should.throw('Connection [tmpConnection] not initialized');
  });

  it('Get default connection', function() {
    ConnectionManager.addConnection('mockconnection');
    ConnectionManager.getConnection().should.be.equal('mockconnection');
  });

  it('Get default connection not initialized', function() {
    (function() {
      ConnectionManager.getConnection();
    }).should.throw('Default connection not initialized');
  });

  it('Has connection not exists', function() {
    ConnectionManager.addConnection('tempConn', 'mockconnection');
    ConnectionManager.hasConnection('tmpConnection').should.be.false;
  });

  it('Has connection default not initialized', function() {
    ConnectionManager.hasConnection().should.be.false;
  });

  it('Has connection true', function() {
    ConnectionManager.addConnection('tempConn', 'mockconnection');
    ConnectionManager.hasConnection('tempConn').should.be.true;
  });

  it('Has connection default true', function() {
    ConnectionManager.addConnection('mockconnection');
    ConnectionManager.hasConnection().should.be.true;
  });
});
