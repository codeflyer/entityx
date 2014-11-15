require('should');
var CoreObject = require('./../../lib/entities/CoreObject');

describe('Object', function() {
  it('Empty object', function() {
    var obj = new CoreObject();
    obj._data.should.be.eql({});
  });

  it('Check key list of an empty object', function() {
    var obj = new CoreObject();
    obj._getDataKeyList().should.be.eql([]);
  });

  it('Check _data after set object (direct access to _data)', function() {
    var obj = new CoreObject();
    obj._setData('temp', 1);
    obj._setData('temp2', 2);
    obj._data.should.be.eql({'temp': 1, 'temp2': 2});
  });

  it('Check key list after set object', function() {
    var obj = new CoreObject();
    obj._setData('temp', 1);
    obj._setData('temp2', 2);
    obj._getDataKeyList().should.be.eql(['temp', 'temp2']);
  });

  it('Check key exists (exists)', function() {
    var obj = new CoreObject();
    obj._data.test = 1;
    obj._keyExists('test').should.be.true;
  });

  it('Check key exists (not exists)', function() {
    var obj = new CoreObject();
    obj._data.test = 1;
    obj._keyExists('testNot').should.be.false;
  });

  it('Check _unset', function() {
    var obj = new CoreObject();
    obj._data.test = 1;
    obj._unset('test');
    obj._keyExists('test').should.be.false;
  });
});
