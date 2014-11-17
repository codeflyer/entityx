require('should');
var sinon = require('sinon');

var path = require('path');
var EntityX = require('../../lib/EntityX');
var Factory = require('../../lib/Factory');
var Entity = require('../../lib/entities/Entity');

describe('Entity: getRepository', function() {
  var sandbox;

  beforeEach(function() {
    EntityX._reset();
    EntityX.setApplicationRoot(path.join(__dirname, '..'));
    EntityX.addModule('classesTest');
    sandbox = sinon.sandbox.create();
  });

  afterEach(function() {
    sandbox.restore();
  });

  it('repositoryName == null', function() {
    var model = new Entity({
      'useTimestamp': true
    });

    try {
      model._getRepository();
      throw 'should be thrown an exception';
    } catch (e) {
      e.code.should.be.equal(100);
    }
  });

  it('repositoryName not null', function() {
    var model = new Entity({
      'useTimestamp': true,
      repositoryName: 'TestModule/Inherit'
    });
    model._init(1);
    var factoryStub = sandbox.stub(Factory, 'getRepository');

    try {
      model._getRepository();
      factoryStub.calledWith('TestModule/Inherit', 1).should.be.true;
    } catch (e) {
      throw e;
    }
  });
});
