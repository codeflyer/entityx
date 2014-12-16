var MongoDBDriver = require('./../../lib/repositories/MongoDBAbstractDriver');

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

  it('useTimestamp true', function() {
    var driver = null;
    (function() {
      driver = new MongoDBDriver({
        'useTimestamp': true,
        'collectionName': 'coll_name'
      });
    }).should.not.throw();

    driver.useTimestamp.should.equal(true);
  });

  it('useTimestamp missing', function() {
    var driver = null;
    (function() {
      driver = new MongoDBDriver({'collectionName': 'coll_name'});
    }).should.not.throw();

    driver.useTimestamp.should.equal(false);
  });

  it('useTimestamp false', function() {
    var driver = null;
    (function() {
      driver = new MongoDBDriver({
        'useTimestamp': false,
        'collectionName': 'coll_name'
      });
    }).should.not.throw();

    driver.useTimestamp.should.equal(false);
  });

  it('timestampFlat true', function() {
    var driver = null;
    (function() {
      driver = new MongoDBDriver({
        'timestampFlat': true,
        'collectionName': 'coll_name'
      });
    }).should.not.throw();

    driver.timestampFlat.should.equal(true);
  });

  it('timestampFlat missing', function() {
    var driver = null;
    (function() {
      driver = new MongoDBDriver({'collectionName': 'coll_name'});
    }).should.not.throw();

    driver.timestampFlat.should.equal(false);
  });

  it('timestampFlat false', function() {
    var driver = null;
    (function() {
      driver = new MongoDBDriver({
        'timestampFlat': false,
        'collectionName': 'coll_name'
      });
    }).should.not.throw();

    driver.timestampFlat.should.equal(false);
  });

  it('init collection name', function() {
    var driver = new MongoDBDriver({'collectionName': 'coll_name'});
    driver.collectionName.should.equal('coll_name');
  });

  it('id == null', function() {
    var driver = null;
    (function() {
      driver = new MongoDBDriver({
        'useTimestamp': false,
        'collectionName': 'coll_name'
      });
    }).should.not.throw();

    (driver._id === null).should.be.true;
  });

  it('ConnectionName param missing', function() {
    var driver = new MongoDBDriver({
      'useTimestamp': true,
      'collectionName': 'coll_name'
    });
    (driver.connectionName == null).should.be.true;
  });

  it('ConnectionName param not valid (length == 0)', function() {
    (function() {
      new MongoDBDriver({
        'useTimestamp': true,
        'collectionName': 'coll_name',
        'connectionName': ''
      });
    }).should.throw('Connection Name not valid');
  });

  it('ConnectionName param not valid (!= string)', function() {
    (function() {
      new MongoDBDriver({
        'useTimestamp': true,
        'collectionName': 'coll_name',
        'connectionName': 1
      });
    }).should.throw('Connection Name not valid');
  });

  it('ConnectionName param valid', function() {
    var driver = new MongoDBDriver({
      'useTimestamp': true,
      'collectionName': 'coll_name',
      'connectionName': 'my-connection'
    });
    driver.connectionName.should.be.equal('my-connection');
  });

});
