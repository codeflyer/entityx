require('should');
var path = require('path');
var EntityX = require('../../../lib/EntityX');
var ValueObject = require('./../../../lib/entities/ValueObject');
var ValueInherit =
    require('./../../classesTest/lib/entities/values/ValueInherit');

var errorCodes = require('../../../lib/errorCodes');

describe('Entity: loadListOfValueObjects', function() {
  beforeEach(function() {
    EntityX._reset();
    EntityX.addModule(path.join(__dirname, '..', '..', 'classesTest'));
  });

  it('Docs not null and not array', function() {
    var obj = new ValueObject({});
    try {
      obj.getLoaderHelper().loadListOfValueObject(
          'TestModule/ValueInherit', 'hello');
      throw 'Should be thrown an error';
    } catch (e) {
      e.code.should.be.equal(errorCodes.TYPE_NOT_ALLOWED);
    }
  });

  it('Docs length not ZERO and is not allowed', function() {
    var obj = new ValueObject({});
    try {
      obj.getLoaderHelper().loadListOfValueObject(
          'TestModule/ValueInherit', [], false);
      throw 'Should be thrown an error';
    } catch (e) {
      e.code.should.be.equal(errorCodes.EMPTY_ARRAY_NOT_ALLOWED);
    }
  });

  it('Docs null and length ZERO not allowed', function() {
    var obj = new ValueObject({});
    try {
      obj.getLoaderHelper().loadListOfValueObject(
          'TestModule/ValueInherit', null, false);
      throw 'Should be thrown an error';
    } catch (e) {
      e.code.should.be.equal(errorCodes.EMPTY_ARRAY_NOT_ALLOWED);
    }
  });

  it('Docs lenght ZERO and length ZERO allowed', function() {
    var obj = new ValueObject({});
    var result = obj.getLoaderHelper().loadListOfValueObject(
        'TestModule/ValueInherit', [], true);
    result.should.be.eql([]);
  });

  it('Docs null and length ZERO allowed', function() {
    var obj = new ValueObject({});
    var result = obj.getLoaderHelper().loadListOfValueObject(
        'TestModule/ValueInherit', null, true);
    result.should.be.eql([]);
  });

  it('Docs null and length ZERO default value allowed)', function() {
    var obj = new ValueObject({});
    var result = obj.getLoaderHelper().loadListOfValueObject(
        'TestModule/ValueInherit', null);
    result.should.be.eql([]);
  });

  it('Check data after set array of objects', function() {
    var obj = new ValueObject({});
    var list = obj.getLoaderHelper().loadListOfValueObject(
        'TestModule/ValueInherit', [{'_id': 1}, {'_id': 2}]);
    list[0].should.be.instanceof(ValueInherit);
    list[1].should.be.instanceof(ValueInherit);
  });
});
