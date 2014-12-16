var MongoDBDriver = require('./../../../lib/repositories/MongoDB');

describe('Repositories, MongoDB: Constructor', function() {

  it('Empty params in constructor', function() {
    (function() {
      new MongoDBDriver();
    }).should.throw('Driver initialization require params');
  });

  it('Wrong param in constructor', function() {
    (function() {
      new MongoDBDriver('');
    }).should.throw('Collection Name not defined');
  });

  it('CollectionName param missing', function() {
    (function() {
      new MongoDBDriver({'useTimestamp': true});
    }).should.throw('Collection Name not defined');
  });

  it('CollectionName param not valid (length == 0)', function() {
    (function() {
      new MongoDBDriver({'useTimestamp': true, 'collectionName': ''});
    }).should.throw('Collection Name not valid');
  });

  it('CollectionName param not valid (!= string)', function() {
    (function() {
      new MongoDBDriver({'useTimestamp': true, 'collectionName': 1});
    }).should.throw('Collection Name not valid');
  });

  it('init collection name', function() {
    var driver = new MongoDBDriver({'collectionName': 'coll_name'});
    driver.collectionName.should.equal('coll_name');
  });

  it('ConnectionName param missing', function() {
    var driver = new MongoDBDriver({
      'collectionName': 'coll_name'
    });
    (driver.connectionName == null).should.be.true;
  });

  it('ConnectionName param not valid (length == 0)', function() {
    (function() {
      new MongoDBDriver({
        'collectionName': 'coll_name',
        'connectionName': ''
      });
    }).should.throw('Connection Name not valid');
  });

  it('ConnectionName param not valid (!= string)', function() {
    (function() {
      new MongoDBDriver({
        'collectionName': 'coll_name',
        'connectionName': 1
      });
    }).should.throw('Connection Name not valid');
  });

  it('ConnectionName param valid', function() {
    var driver = new MongoDBDriver({
      'collectionName': 'coll_name',
      'connectionName': 'my-connection'
    });
    driver.connectionName.should.be.equal('my-connection');
  });

});
