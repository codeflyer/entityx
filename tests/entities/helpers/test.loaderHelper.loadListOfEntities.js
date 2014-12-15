require('should');
var path = require('path');
var EntityX = require('../../../lib/EntityX');
var Entity = require('./../../../lib/entities/Entity');
var EntityInherit = require('./../../classesTest/lib/entities/EntityInherit');
var errorCodes = require('../../../lib/errorCodes');

describe('Entity: loadListOfEntities', function() {
  beforeEach(function() {
    EntityX._reset();
    EntityX.addModule(path.join(__dirname, '..', '..', 'classesTest'));
  });

  it('Docs not null and not array', function() {
    var obj = new Entity({});
    try {
      obj.getLoaderHelper().loadListOfEntities(
          'TestModule/EntityInherit', 'hello');
      throw 'Should be thrown an error';
    } catch (e) {
      e.code.should.be.equal(errorCodes.TYPE_NOT_ALLOWED);
    }
  });

  it('Docs length not ZERO and is not allowed', function() {
    var obj = new Entity({});
    try {
      obj.getLoaderHelper().loadListOfEntities(
          'TestModule/EntityInherit', [], false);
      throw 'Should be thrown an error';
    } catch (e) {
      e.code.should.be.equal(errorCodes.EMPTY_ARRAY_NOT_ALLOWED);
    }
  });

  it('Docs null and length ZERO not allowed', function() {
    var obj = new Entity({});
    try {
      obj.getLoaderHelper().loadListOfEntities(
          'TestModule/EntityInherit', null, false);
      throw 'Should be thrown an error';
    } catch (e) {
      e.code.should.be.equal(errorCodes.EMPTY_ARRAY_NOT_ALLOWED);
    }
  });

  it('Docs lenght ZERO and length ZERO allowed', function() {
    var obj = new Entity({});
    var result = obj.getLoaderHelper().loadListOfEntities(
        'TestModule/EntityInherit', [], true);
    result.should.be.eql([]);
  });

  it('Docs null and length ZERO allowed', function() {
    var obj = new Entity({});
    var result = obj.getLoaderHelper().loadListOfEntities(
        'TestModule/EntityInherit', null, true);
    result.should.be.eql([]);
  });

  it('Docs null and length ZERO default value allowed)', function() {
    var obj = new Entity({});
    var result = obj.getLoaderHelper().loadListOfEntities(
        'TestModule/EntityInherit', null);
    result.should.be.eql([]);
  });

  it('Check data after set array of objects', function() {
    var obj = new Entity({});
    var list = obj.getLoaderHelper().loadListOfEntities(
        'TestModule/EntityInherit', [{'_id': 1}, {'_id': 2}]);
    list[0].should.be.instanceof(EntityInherit);
    list[1].should.be.instanceof(EntityInherit);
  });
});
