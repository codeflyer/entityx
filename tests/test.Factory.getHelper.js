require('should');

var path = require('path');

var EntityX = require('../lib/EntityX');
var Factory = require('../lib/Factory');

describe('Factory: getService', function() {
  beforeEach(function() {
    EntityX._reset();
    EntityX.setApplicationRoot(path.join(__dirname));
    EntityX.addModule('classesTest');
    Factory.reset();
  });

  it('Get service (exists)', function() {
    try {
      Factory.getService('TestModule/Foo', {});
    } catch (e) {
      throw e;
    }
  });

  it('Get service (Module init, class not not exists)', function() {
    (function() {
      Factory.getService('TestModule/Inherit2', {});
    }).should.throw(
        'Class [TestModule/Inherit2] of type [services] not defined');
  });

  it('Set service', function() {
    function injectedClass() {
      this.check = 'check';
    }

    Factory.setService('TestModule/Injected', injectedClass);
    var model = Factory.getService('TestModule/Injected');
    model.check.should.be.equal('check');
  });
});
