var EntityX = require('../lib/EntityX');
var Factory = require('../lib/Factory');
var path = require('path');
describe('Factory: isModuleSet', function() {

  beforeEach(function() {
    EntityX._reset();
    Factory.reset();
  });

  it('Test isModuleSet (false)', function() {
    EntityX.isModuleSet('TestModule').should.be.false;
  });

  it('Test isModuleSet (true)', function() {
    EntityX.addModule(path.join(__dirname, 'classesTest'));
    EntityX.isModuleSet('TestModule').should.be.true;
  });
});
