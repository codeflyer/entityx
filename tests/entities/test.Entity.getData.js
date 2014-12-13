require('should');
var path = require('path');
var EntityX = require('./../../lib/EntityX');
var Entity = require('./../../lib/entities/Entity');

describe('Object: getData', function() {

  beforeEach(function() {
    EntityX._reset();
    EntityX.addModule(path.join(__dirname, '..', 'classesTest'));
  });

  it('Get data not initialized', function() {
    var obj = new Entity({'useTimestamp': true});
    obj._isLoad = true;
    (function() {
      obj._getData('entity');
    }).should.throw('Key [entity] not initialized');
  });

  it('Get data not loaded initialized', function() {
    var obj = new Entity({'useTimestamp': true});
    obj._isNewObject = false;
    (function() {
      obj._getData('entity');
    }).should.throw('Entity not loaded: need entity.load().then(...)');
  });

  it('Get data not loaded but newObject', function() {
    var obj = new Entity({'useTimestamp': true});
    obj._setData('entity', 2);
    obj._getData('entity').should.be.equal(2);
  });

  it('Get data with result', function() {
    var obj = new Entity({'useTimestamp': true});
    obj._isLoad = true;
    obj._data.test = 100;
    obj._getData('test').should.be.equal(100);
    obj._data.test = 200;
    obj._getData('test').should.be.equal(200);
  });
});
