var MongoDBDriver =
    require('./../../../lib/repositories/MongoDBAbstractDriver');
var errorCodes = require('./../../../lib/errorCodes');

describe('Repositories, MongoDBAbstract: _requireInit', function() {

  it('isInit == false', function() {
    var driver;
    driver = new MongoDBDriver({
      'useTimestamp': false,
      'collectionName': 'coll_name'
    });
    try {
      driver._requireInit();
      throw new Error('should be thrown an error');
    } catch (e) {
      e.code.should.be.equal(errorCodes.REPOSITORY_NOT_INIT);
    }
  });

  it('isInit == true', function() {
    var driver;
    driver = new MongoDBDriver({
      'useTimestamp': false,
      'collectionName': 'coll_name'
    });
    driver.setId(1);
    try {
      driver._requireInit();
    } catch (e) {
      throw 'should be thrown an error';
    }
  });
});
