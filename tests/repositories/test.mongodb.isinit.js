require('should');

var MongoDBDriver = require('./../../lib/repositories/MongoDB');

describe('Repositories, MongoDB: Constructor', function() {

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
    (function() {
      driver = new MongoDBDriver({
        'useTimestamp': false,
        'collectionName': 'coll_name'
      });
    }).should.not.throw();

    driver.setId(1);
    driver.isInit().should.be.true;
  });
});
