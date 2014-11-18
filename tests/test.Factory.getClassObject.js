var EntityX = require('../lib/EntityX');
var Factory = require('../lib/Factory');
var path = require('path');

var sinon = require('sinon');
require('should');

describe('FACTORY Factory: getClassObject', function() {
  var sandbox;

  beforeEach(function() {
    EntityX._reset();
    EntityX.setApplicationRoot(path.join(__dirname));
    EntityX.addModule('classesTest');
    Factory.reset();
    sandbox = sinon.sandbox.create();
  });

  afterEach(function() {
    sandbox.restore();
  });

  it('type not defined', function() {
    try {
      Factory._getClassObject('unknownType', 'TestModule/SomeClassName');
      throw 'should be throw an exception';
    } catch (e) {
      e.code.should.be.equal(404);
    }
  });

  it('module not exists', function() {
    try {
      Factory._getClassObject('entities', 'TestModule2/SomeClassName');
      throw 'should be throw an exception';
    } catch (e) {
      e.code.should.be.equal(404);
      e.message.should.be.equal('Module [TestModule2] not initialized');
    }
  });

  it('Called one time, class exists, no cache', function() {
    try {
      var spy = sandbox.spy(Factory, '_resolveName');
      Factory._getClassObject('entities', 'TestModule/EntityInherit');
      spy.calledOnce.should.be.true;
    } catch (e) {
      throw e;
    }
  });

  it('Called twice, class exists, cache', function() {
    try {
      var spy = sandbox.spy(Factory, '_resolveName');
      Factory._getClassObject('entities', 'TestModule/EntityInherit');
      Factory._getClassObject('entities', 'TestModule/EntityInherit');
      spy.calledOnce.should.be.true;
    } catch (e) {
      throw e;
    }
  });

  it('Called one, class NOT exists', function() {
    try {
      Factory._getClassObject('entities', 'TestModule/EntityNotExists');
      throw 'should be throw an exception';
    } catch (e) {
      e.code.should.be.equal(400);
      e.message.should.be.equal(
          'Class [TestModule/EntityNotExists] of type [entities] not defined');
    }
  });

});
