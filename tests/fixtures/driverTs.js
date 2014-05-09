exports.test_driver_ts = [
    {'_id' : 1, 'name' : 'test 1', '_ts' : {'created' : new Date(), 'modified' : new Date(), 'deleted' : null}},
    {'_id' : 2, 'name' : 'test 2', '_ts' : {'created' : new Date(), 'modified' : new Date(), 'deleted' : null}},
    {'_id' : 3, 'name' : 'test 3', '_ts' : {'created' : new Date(), 'modified' : new Date(), 'deleted' : new Date()}}
];

exports.sequences = [
    { "_id" : 'test_driver_ts', "seq" : 3 }
];