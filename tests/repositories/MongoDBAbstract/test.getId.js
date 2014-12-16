var MongoDBDriver =
    require('./../../../lib/repositories/MongoDBAbstractDriver');

describe('Repositories, MongoDBAbstract: getId', function() {

  it('isInit == false', function() {
    var driver;
    (function() {
      driver = new MongoDBDriver({
        'useTimestamp': false,
        'collectionName': 'coll_name'
      });
    }).should.not.throw();

    driver.isInit().should.be.false;
  });

  it('isInit == false', function() {
    var driver;
    driver = new MongoDBDriver({
      'useTimestamp': false,
      'collectionName': 'coll_name'
    });
    driver.setId(1);
    driver.getId().should.be.equal(1);
  });
});
