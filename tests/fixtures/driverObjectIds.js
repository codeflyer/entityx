var ObjectID = require('mongodb').ObjectID;

// jscs:disable requireCamelCaseOrUpperCaseIdentifiers
exports.test_object_ids = [
  {'_id': new ObjectID(1), 'name': 'test 1'},
  {'_id': 2, 'name': 'test 2'},
  {'_id': 3, 'name': 'test 3'}
];
