var util = require('util');
var repositories = {
  'MongoDBInner': require('../../../repositories/MongoDBInner'),
  'MongoDBObjectID': require('../../../repositories/MongoDBObjectID'),
  'MongoDBSequence': require('../../../repositories/MongoDBSequence')
};

module.exports = function(attributes) {
  var repository = repositories[attributes.repositoryType];
  function returnFunction(id) {
    repository.call(this, {
      collectionName: attributes.collectionName,
      useTimestamp: attributes.useTimestamp
    }, id);
  }

  util.inherits(returnFunction, repository);
  return returnFunction;
};
