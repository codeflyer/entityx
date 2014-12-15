var path = require('path');
var EntityX = require('../../lib/EntityX');
var CoreObject = require('./../../lib/entities/CoreObject');

describe('Object: getData2', function() {

  beforeEach(function() {
    EntityX._reset();
    EntityX.addModule(path.join(__dirname, '..', 'classesTest'));
  });

  it('Get data not initialized', function() {
    var obj = new CoreObject();
    (function() {
      obj._getData('entity');
    }).should.throw('Key [entity] not initialized');
  });

  it('Get data with result', function() {
    var obj = new CoreObject();
    obj._data.test = 100;
    obj._getData('test').should.be.equal(100);
    obj._data.test = 200;
    obj._getData('test').should.be.equal(200);
  });
});
