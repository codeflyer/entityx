var path = require('path');
var ObjectID = require('mongodb').ObjectID;

var EntityX = require('../lib/EntityX');
var Factory = require('../lib/Factory');

describe('Factory: getEntity', function() {
  beforeEach(function() {
    EntityX._reset();
    EntityX.addModule(path.join(__dirname, 'classesTest'));
    Factory.reset();
  });

  it('Get model First time (exists)', function() {
    try {
      Factory.getEntity('TestModule/EntityInherit');
    } catch (e) {
      throw e;
    }
  });

  it('Get model First time (Module init, class not not exists)', function() {
    (function() {
      Factory.getEntity('TestModule/EntityInherit2');
    }).should.throw(
        'Class [TestModule/EntityInherit2] of type [entities] not defined');
  });

  it('Get model not init', function() {
    var model = Factory.getEntity('TestModule/EntityInherit');
    (model._id == null).should.be.true;
  });

  it('Get model not init scalar', function() {
    var model = Factory.getEntity('TestModule/EntityInherit', 5);
    model._id.should.be.equal(5);
  });

  it('Get model not init ObjectId', function() {
    var newId = new ObjectID();
    var model = Factory.getEntity('TestModule/EntityInherit', newId);
    model._id.should.be.equal(newId.toString());
  });

  it('Get model with preload', function() {
    var struct = {'name': 'davide', 'surname': 'fiorello'};
    var model = Factory.getEntity('TestModule/EntityInherit', 5, struct);

    model._preloadDetails.should.be.eql(struct);
  });

  it('Get model with NO preload', function() {
    var model = Factory.getEntity('TestModule/EntityInherit', 5);
    (model._preloadDetails == null).should.be.true;
  });

  it('Set entity', function() {
    function injectedClass() {
      this.check = 'check';
    }
    Factory.setEntity('TestModule/Injected', injectedClass);
    var model = Factory.getEntity('TestModule/Injected');
    model.check.should.be.equal('check');
  });
});
