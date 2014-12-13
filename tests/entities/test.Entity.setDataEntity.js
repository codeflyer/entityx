require('should');
var path = require('path');
var EntityX = require('../../lib/EntityX');
var Entity = require('./../../lib/entities/Entity');
var EntityInherit = require('./../classesTest/lib/entities/EntityInherit');

describe('Entity: setDataEntity', function() {

  beforeEach(function() {
    EntityX._reset();
    EntityX.addModule(path.join(__dirname, '..', 'classesTest'));
  });

  it('Set data with an invalid doc', function() {
    var obj = new Entity({});
    try {
      obj._setData('entity',
          obj.getLoaderHelper().loadDataEntity('TestModule/EntityInherit', {}));
    } catch (e) {
      e.code.should.be.equal(403);
      e.message.should.be.equal('Invalid identifier [Object without _ID]');
    }
  });

  it('Check data after set object', function() {
    var obj = new Entity({});
    obj._setData('entity',
        obj.getLoaderHelper().loadDataEntity(
            'TestModule/EntityInherit', {'_id': 1}));
    obj._getDataKeyList().should.be.eql(['entity']);
    obj._data.entity.should.be.instanceof(EntityInherit);
  });

  it('Set data with an empty doc with entity non nullable', function() {
    var obj = new Entity({});
    try {
      obj._setData('entity',
          obj.getLoaderHelper().loadDataEntity(
              'TestModule/EntityInherit', null, false));
    } catch (e) {
      e.code.should.be.equal(401);
      e.message.should.be.equal('Null object non accepted');
    }
  });

  it('Set data with an empty doc with entity nullable', function() {
    var obj = new Entity({});
    obj._setData('entity',
        obj.getLoaderHelper().loadDataEntity(
            'TestModule/EntityInherit', null, true));
    (obj._data.entity == null).should.be.true;
  });

  it('Set data with an invalid identifier', function() {
    var obj = new Entity({});
    (function() {
      obj._setData('entity',
          obj.getLoaderHelper().loadDataEntity('TestModule/EntityInherit', 10));
    }).should.throw('Invalid identifier');
  });

  it('Check data after set array of objects', function() {
    var obj = new Entity({});
    obj._setData('entity',
        obj.getLoaderHelper().loadDataEntity(
            'TestModule/EntityInherit', [{'_id': 1}, {'_id': 2}]));
    obj._getDataKeyList().should.be.eql(['entity']);
    obj._data.entity[0].should.be.instanceof(EntityInherit);
    obj._data.entity[1].should.be.instanceof(EntityInherit);
  });

  it('Set data with an empty doc in array with entity non nullable',
      function() {
        var obj = new Entity({});
        (function() {
          obj._setData('entity',
              obj.getLoaderHelper().loadDataEntity(
                  'TestModule/EntityInherit', [], false));
        }).should.throw('Null object non accepted');
      }
  );

  it('Set data with an empty array with entity nullable', function() {
    var obj = new Entity({});
    obj._setData('entity',
        obj.getLoaderHelper().loadDataEntity(
            'TestModule/EntityInherit', [], true));
    (obj._data.entity == null).should.be.true;
  });

  it('Set data with an empty doc in array with entity not nullable',
      function() {
        var obj = new Entity({});
        (function() {
          obj._setData('entity',
              obj.getLoaderHelper().loadDataEntity(
                  'TestModule/EntityInherit', [
                    {'_id': 1}, null, {'_id': 2}], false));
        }).should.throw('Null object non accepted in array');
      }
  );

  it('Set data with an invalid identifier', function() {
    var obj = new Entity({});
    (function() {
      obj._setData('entity',
          obj.getLoaderHelper().loadDataEntity(
              'TestModule/EntityInherit', [10]));
    }).should.throw('Invalid identifier');
  });

  it('Set data with an invalid identifier', function() {
    var obj = new Entity({});
    (function() {
      obj._setData('entity',
          obj.getLoaderHelper().loadDataEntity(
              'TestModule/EntityInherit', [{'test': 10}]));
    }).should.throw('Invalid identifier [Object in Array without _ID]');
  });
});
