require('should');

var path = require('path');

var EntityX = require('../lib/EntityX');
var Factory = require('../lib/Factory');

describe('Factory: getHelper', function() {
  beforeEach(function() {
    EntityX._reset();
    EntityX.setApplicationRoot(path.join(__dirname));
    EntityX.addModule('classesTest');
    Factory.reset();
  });

  it('Get helper (exists)', function() {
    try {
      Factory.getHelper('TestModule/Foo', {});
    } catch (e) {
      throw e;
    }
  });

  it('Get helper (Module init, class not not exists)', function() {
    (function() {
      Factory.getHelper('TestModule/Inherit2', {});
    }).should.throw(
        'Class [TestModule/Inherit2] of type [helpers] not defined');
  });

  it('Set helper', function() {
    function injectedClass() {
      this.check = 'check';
    }

    Factory.setHelper('TestModule/Injected', injectedClass);
    var model = Factory.getHelper('TestModule/Injected');
    model.check.should.be.equal('check');
  });
});
