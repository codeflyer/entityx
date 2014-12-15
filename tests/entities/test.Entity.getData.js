require('should');
var path = require('path');
var Factory = require('../../lib/Factory');
var Entity = require('./../../lib/entities/Entity');

describe("Object: setDataEntity", function() {

  before(function() {
    var rootPath = path.join(__dirname, '../..');
    Factory.setApplicationRoot(rootPath);
    Factory.setModule('TestModule', 'tests/classesTest');

  });

  it("Get data not initialized", function() {
    var obj = new Entity({'useTimestamp': true});
    obj._isLoad = true;
    (function() {
      obj._getData('entity');
    }).should.throw("Key not initialized");
  });

  it("Get data not loaded initialized", function() {
    var obj = new Entity({'useTimestamp': true});
    try {
      obj._getData('entity');
      throw 'should be throw';
    } catch (e) {
      e.message.should.be.equal('Key not initialized');
    }
  });

  it("Get data with result", function() {
    var obj = new Entity({'useTimestamp': true});
    obj._isLoad = true;
    obj._data.test = 100;
    obj._getData('test').should.be.equal(100);
    obj._data.test = 200;
    obj._getData('test').should.be.equal(200);
  });

});