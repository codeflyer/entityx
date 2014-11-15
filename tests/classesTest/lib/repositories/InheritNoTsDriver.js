var util = require('util');
var MongoDBDriver = require('./../../../../lib/repositories/MongoDBSequence');

var InheritNoTsDriver = function(id) {
  MongoDBDriver.call(this, {
    collectionName: 'test_driver_no_ts',
    useTimestamp: false
  }, id);
};
util.inherits(InheritNoTsDriver, MongoDBDriver);

module.exports = InheritNoTsDriver;
