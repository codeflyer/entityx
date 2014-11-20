var util = require('util');
var Entity = require('../../../entities/Entity');

module.exports = function(attributes) {
  function returnFunction() {
    Entity.call(this,
        {
          'useTimestamp': attributes.useTimestamp,
          repositoryName: attributes.module + '/' + attributes.className
        });
  }
  util.inherits(returnFunction, Entity);
  return returnFunction;
};
