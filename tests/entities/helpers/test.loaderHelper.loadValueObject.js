require('should');
var path = require('path');
var EntityX = require('../../../lib/EntityX');
var errorCodes = require('../../../lib/errorCodes');
var ValueObject = require('./../../../lib/entities/ValueObject');
var ValueInherit =
    require('./../../classesTest/lib/entities/values/ValueInherit');

describe('Entity: loadValueObject', function() {

  beforeEach(function() {
    EntityX._reset();
    EntityX.addModule(path.join(__dirname, '..', '..', 'classesTest'));
  });

  it('Set data with an empty doc with entity nullable', function() {
    var obj = new ValueObject({});
    try {
      obj.getLoaderHelper().loadValueObject(
          'TestModule/ValueInherit', null, false);
    } catch (e) {
      e.code.should.be.equal(errorCodes.NULL_OBJECT_NOT_ALLOWED);
    }
  });

  it('Set data with an empty doc with entity nullable', function() {
    var obj = new ValueObject({});
    var result = obj.getLoaderHelper().loadValueObject(
        'TestModule/ValueInherit', null, true);
    (result == null).should.be.true;
  });

  it('Set data with null and with entity nullable null', function() {
    var obj = new ValueObject({});
    var result = obj.getLoaderHelper().loadValueObject(
        'TestModule/ValueInherit', null, null);
    (result == null).should.be.true;
  });

  it('Set data with null and with entity nullable not defined', function() {
    var obj = new ValueObject({});
    var result = obj.getLoaderHelper().loadValueObject(
        'TestModule/ValueInherit', null);
    (result == null).should.be.true;
  });

  it('Set data with doc not object', function() {
    var obj = new ValueObject({});
    try {
      obj.getLoaderHelper()
          .loadValueObject('TestModule/ValueInherit', 'hello');
    } catch (e) {
      e.code.should.be.equal(errorCodes.TYPE_NOT_ALLOWED);
    }
  });

  it('Check data after set object', function() {
    var obj = new ValueObject({});
    var result = obj.getLoaderHelper().loadValueObject(
        'TestModule/ValueInherit', {'_id': 1});
    result.should.be.instanceof(ValueInherit);
  });
});
