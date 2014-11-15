require('should');
var path = require('path');
var EntityX = require('../../lib/EntityX');
var Factory = require('../../lib/Factory');
var CoreObject = require('./../../lib/entities/CoreObject');
var EntityInherit = require('./../classesTest/lib/entities/EntityInherit');

describe('Object: setDataEntity', function() {

  beforeEach(function() {
    EntityX._reset();
    EntityX.setApplicationRoot(path.join(__dirname, '..'));
    EntityX.addModule('classesTest');
  });

  it('Set data with an invalid doc', function() {
    var obj = new CoreObject();
    (function() {
      obj._setDataEntity('entity', 'TestModule/EntityInherit', {});
    }).should.throw('Invalid identifier [Object without _ID]');
  });

  it('Check data after set object', function() {
    var obj = new CoreObject();
    obj._setDataEntity('entity', 'TestModule/EntityInherit', {'_id': 1});
    obj._getDataKeyList().should.be.eql(['entity']);
    obj._data.entity.should.be.instanceof(EntityInherit);
  });

  it('Set data with an empty doc with entity non nullable', function() {
    var obj = new CoreObject();
    (function() {
      obj._setDataEntity('entity', 'TestModule/EntityInherit', null, false);
    }).should.throw('Null object non accepted');
  });

  it('Set data with an empty doc with entity nullable', function() {
    var obj = new CoreObject();
    obj._setDataEntity('entity', 'TestModule/EntityInherit', null, true);
    (obj._data.entity == null).should.be.true;
  });

  it('Set data with an invalid identifier', function() {
    var obj = new CoreObject();
    (function() {
      obj._setDataEntity('entity', 'TestModule/EntityInherit', 10);
    }).should.throw('Invalid identifier');
  });
});
