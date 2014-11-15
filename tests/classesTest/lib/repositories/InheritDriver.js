var util = require('util');
var MongoDBDriver = require('./../../../../lib/repositories/MongoDBSequence');

var InheritDriver = function(id) {
  MongoDBDriver.call(this, {
    collectionName: 'test_driver_ts',
    useTimestamp: true
  }, id);
};
util.inherits(InheritDriver, MongoDBDriver);

module.exports = InheritDriver;
