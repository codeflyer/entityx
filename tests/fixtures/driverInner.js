// jscs:disable requireCamelCaseOrUpperCaseIdentifiers
exports.test_driver_inner = [
  {
    '_id': 1, 'name': 'test 1', list: [
    {'_id': 1, value: 'foo'},
    {'_id': 2, value: 'bar'},
    {'_id': 3, value: 'bom'}
  ]
  }
];

exports.sequences = [
  {'_id': 'test_driver_inner', 'seq': 3},
  {'_id': 'test_driver_inner:list', 'seq': 3}
];
