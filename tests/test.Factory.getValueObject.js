var path = require('path');

var EntityX = require('../lib/EntityX');
var Factory = require('../lib/Factory');

describe('Factory: getValueObject', function() {
  beforeEach(function() {
    EntityX._reset();
    EntityX.addModule(path.join(__dirname, 'classesTest'));
    Factory.reset();
  });

  it('Get valueObject (exists)', function() {
    try {
      Factory.getValueObject('TestModule/ValueInherit', {});
    } catch (e) {
      throw e;
    }
  });

  it('Get valueObject (Module init, class not not exists)', function() {
    (function() {
      Factory.getValueObject('TestModule/Inherit2', {});
    }).should.throw(
        'Class [TestModule/Inherit2] of type [valueObject] not defined');
  });

  it('Get valueObject not init', function() {
    var model = Factory.getValueObject('TestModule/ValueInherit', {});
    (model.getName() == null).should.be.true;
    (model.getSurname() == null).should.be.true;
  });

  it('Get valueObject init', function() {
    var model = Factory.getValueObject('TestModule/ValueInherit',
        {'name': 'myName', 'surname': 'mySurname'});
    model.getName().should.be.equal('myName');
    model.getSurname().should.be.equal('mySurname');
  });

  it('Set valueObject', function() {
    function injectedClass() {
      this.check = 'check';
    }

    Factory.setValueObject('TestModule/Injected', injectedClass);
    var model = Factory.getValueObject('TestModule/Injected');
    model.check.should.be.equal('check');
  });
});
