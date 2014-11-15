var should = require('should');
var CoreObjectInherit =
    require('./../classesTest/lib/entities/CoreObjectInherit');

describe('Object', function() {

  it('Test set/get', function() {
    var obj = new CoreObjectInherit();
    obj.setName('pippo');
    should.strictEqual(obj.getName(), 'pippo');
  });

  it('Test get (not exists)', function() {
    var obj = new CoreObjectInherit();
    (function() {
      obj.getName();
    }).should.throw('Key [name] not initialized');
  });

  it('Test exists', function() {
    var obj = new CoreObjectInherit();
    should.strictEqual(obj._keyExists('name'), false);
    obj.setName('pippo');
    should.strictEqual(obj._keyExists('name'), true);
  });

  it('Test unset', function() {
    var obj = new CoreObjectInherit();
    should.strictEqual(obj._keyExists('name'), false);
    obj.setName('pippo');
    should.strictEqual(obj._keyExists('name'), true);
    obj._unset('name');
    should.strictEqual(obj._keyExists('name'), false);
  });
});
