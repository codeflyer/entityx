require('should');
var path = require('path');
var EntityX = require('../../lib/EntityX');
var Entity = require('./../../lib/entities/Entity');

describe('Entity: loadDataValueObject', function() {

  beforeEach(function() {
    EntityX._reset();
    EntityX.addModule(path.join(__dirname, '..', 'classesTest'));
  });

  it('Set data value object with an invalid doc', function() {
    var obj = new Entity({});
    try {
      obj._setData('entity',
          obj.getLoaderHelper()
              .loadDataValueObject('TestModule/ValueInherit', {}));
    } catch (e) {
      e.code.should.be.equal(401);
      e.message.should.be.equal('Null object non accepted');
    }
  });

  it('Set data with an empty doc with valueObject non nullable', function() {
    var obj = new Entity({});
    try {
      obj._setData('entity',
          obj.getLoaderHelper().loadDataValueObject(
              'TestModule/ValueInherit', null, false));
    } catch (e) {
      e.code.should.be.equal(401);
      e.message.should.be.equal('Null object non accepted');
    }
  });

  it('Set data with an empty doc with valueObject nullable', function() {
    var obj = new Entity({});
    obj._setData('entity',
        obj.getLoaderHelper().loadDataValueObject(
            'TestModule/ValueInherit', null, true));
    (obj._data.entity == null).should.be.true;
  });
});
