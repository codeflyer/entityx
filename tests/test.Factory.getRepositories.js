var path = require('path');

var EntityX = require('../lib/EntityX');
var Factory = require('../lib/Factory');

describe('Factory: getRepositories', function() {
  beforeEach(function() {
    EntityX._reset();
    EntityX.addModule(path.join(__dirname, 'classesTest'));
    Factory.reset();
  });

  it('Get repository (exists)', function() {
    try {
      Factory.getRepository('TestModule/Inherit');
    } catch (e) {
      throw e;
    }
  });

  it('Get repository (Module init, class not not exists)', function() {
    (function() {
      Factory.getRepository('TestModule/Inherit2');
    }).should.throw(
        'Class [TestModule/Inherit2] of type [repositories] not defined');
  });

  it('Get repository not init', function() {
    var model = Factory.getRepository('TestModule/Inherit');
    (model._id == null).should.be.true;
  });

  it('Get repository init scalar', function() {
    var model = Factory.getRepository('TestModule/Inherit', 5);
    model._id.should.be.equal(5);
  });

  it('Set repository', function() {
    function injectedClass() {
      this.check = 'check';
    }
    Factory.setRepository('TestModule/Injected', injectedClass);
    var model = Factory.getRepository('TestModule/Injected');
    model.check.should.be.equal('check');
  });
});
