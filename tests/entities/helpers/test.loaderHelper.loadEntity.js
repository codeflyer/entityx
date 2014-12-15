require('should');
var path = require('path');
var EntityX = require('../../../lib/EntityX');
var Entity = require('./../../../lib/entities/Entity');
var EntityInherit = require('./../../classesTest/lib/entities/EntityInherit');
var errorCodes = require('../../../lib/errorCodes');

describe('Entity: loadEntity', function() {

  beforeEach(function() {
    EntityX._reset();
    EntityX.addModule(path.join(__dirname, '..', '..', 'classesTest'));
  });

  it('Set data with an empty doc with entity non nullable', function() {
    var obj = new Entity({});
    try {
      obj.getLoaderHelper().loadEntity(
          'TestModule/EntityInherit', null, false);
    } catch (e) {
      e.code.should.be.equal(errorCodes.NULL_OBJECT_NOT_ALLOWED);
    }
  });

  it('Set data with an empty doc with entity nullable', function() {
    var obj = new Entity({});
    var result = obj.getLoaderHelper().loadEntity(
        'TestModule/EntityInherit', null, true);
    (result == null).should.be.true;
  });

  it('Set data with null and with entity nullable null', function() {
    var obj = new Entity({});
    var result = obj.getLoaderHelper().loadEntity(
        'TestModule/EntityInherit', null, null);
    (result == null).should.be.true;
  });

  it('Set data with null and with entity nullable not defined', function() {
    var obj = new Entity({});
    var result = obj.getLoaderHelper().loadEntity(
        'TestModule/EntityInherit', null);
    (result == null).should.be.true;
  });

  it('Set data with doc not object', function() {
    var obj = new Entity({});
    try {
      obj.getLoaderHelper().loadEntity('TestModule/EntityInherit', 'hello');
    } catch (e) {
      e.code.should.be.equal(errorCodes.TYPE_NOT_ALLOWED);
    }
  });

  it('Set data with an invalid doc', function() {
    var obj = new Entity({});
    try {
      obj.getLoaderHelper().loadEntity('TestModule/EntityInherit', {});
    } catch (e) {
      e.code.should.be.equal(errorCodes.INVALID_IDENTIFIER);
    }
  });

  it('Check data after set object', function() {
    var obj = new Entity({});
    var result = obj.getLoaderHelper().loadEntity(
        'TestModule/EntityInherit', {'_id': 1});
    result.should.be.instanceof(EntityInherit);
  });
});
