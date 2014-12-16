var MongoDBDriver =
    require('./../../../lib/repositories/MongoDBAbstractDriver');

describe('Repositories, MongoDBAbstract: Constructor', function() {

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
});
