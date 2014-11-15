require('should');
var CoreObjectInherit =
    require('./../classesTest/lib/entities/CoreObjectInherit');

describe('Object', function() {

  it('Test set/get', function() {
    var obj = new CoreObjectInherit();
    obj.setName('pippo');
    obj.getName().should.be.equal('pippo');
  });

  it('Test get (not exists)', function() {
    var obj = new CoreObjectInherit();
    (function() {
      obj.getName();
    }).should.throw('Key [name] not initialized');
  });

  it('Test exists', function() {
    var obj = new CoreObjectInherit();
    obj._keyExists('name').should.be.false;
    obj.setName('pippo');
    obj._keyExists('name').should.be.true;
  });

  it('Test unset', function() {
    var obj = new CoreObjectInherit();
    obj._keyExists('name').should.be.false;
    obj.setName('pippo');
    obj._keyExists('name').should.be.true;
    obj._unset('name');
    obj._keyExists('name').should.be.false;
  });
});
