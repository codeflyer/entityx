var EntityX = require('../lib/EntityX');
var Factory = require('../lib/Factory');
var path = require('path');
var ObjectID = require('mongodb').ObjectID;

var sinon = require('sinon');
require('should');

describe('Factory: getModel', function() {
  var rootPath = path.join(__dirname, '..');
  var spyIsModuleSet;
  var spyGetModulePath;
  var sandbox;

  beforeEach(function() {
    EntityX._reset();
    EntityX.setApplicationRoot(path.join(__dirname));
    EntityX.addModule('classesTest');
    Factory.reset();
    sandbox = sinon.sandbox.create();
    spyIsModuleSet = sandbox.spy(EntityX, 'isModuleSet');
    spyGetModulePath = sandbox.spy(EntityX, 'getModule');
  });

  afterEach(function() {
    sandbox.restore();
  });

  it('Get model First time (exists)', function() {
    Factory.getModel('TestModule/EntityInherit');
    spyIsModuleSet.calledWithExactly('TestModule').should.be.true;
    spyGetModulePath.calledWithExactly('TestModule').should.be.true;
    spyIsModuleSet.calledOnce.should.be.true;
    spyGetModulePath.calledOnce.should.be.true;
  });

  it('Get model First time (module not init not exists)', function() {
    (function() {
      Factory.getModel('TestModule/EntityInherit2');
    }).should.throw('Cannot find module \'' +
        rootPath + '/tests/classesTest/lib/entities/EntityInherit2\'');
    spyIsModuleSet.calledWithExactly('TestModule').should.be.true;
    spyGetModulePath.calledWithExactly('TestModule').should.be.true;
    spyIsModuleSet.calledOnce.should.be.true;
    spyGetModulePath.calledOnce.should.be.true;
  });

  it('Get model Second time', function() {
    Factory.getModel('TestModule/EntityInherit');

    Factory.getModel('TestModule/EntityInherit');

    spyIsModuleSet.calledOnce.should.be.true;
    spyGetModulePath.calledOnce.should.be.true;
  });

  it('Get model not init', function() {
    var model = Factory.getModel('TestModule/EntityInherit');
    (model._id == null).should.be.true;
  });

  it('Get model not init scalar', function() {
    var model = Factory.getModel('TestModule/EntityInherit', 5);
    model._id.should.be.equal(5);
  });

  it('Get model not init ObjectId', function() {
    var newId = new ObjectID();
    var model = Factory.getModel('TestModule/EntityInherit', newId);

    model._id.should.be.equal(newId.toString());
  });

  it('Get model with preload', function() {
    var struct = {'name': 'davide', 'surname': 'fiorello'};
    var model = Factory.getModel('TestModule/EntityInherit', 5, struct);

    model._preloadDetails.should.be.eql(struct);
  });

  it('Get model with NO preload', function() {
    var model = Factory.getModel('TestModule/EntityInherit', 5);

    (model._preloadDetails == null).should.be.true;
  });
});
