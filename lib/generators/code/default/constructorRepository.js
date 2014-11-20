var util = require('util');
var drivers = {
  'MongoDBInner': require('../../../repositories/MongoDBInner'),
  'MongoDBObjectID': require('../../../repositories/MongoDBObjectID'),
  'MongoDBSequence': require('../../../repositories/MongoDBSequence')
};

module.exports = function(attributes) {
  var driver = drivers[attributes.driverType];
  function returnFunction(id) {
    driver.call(this, {
      collectionName: attributes.collectionName,
      useTimestamp: attributes.useTimestamp
    }, id);
  }

  util.inherits(returnFunction, driver);
  return returnFunction;
};
