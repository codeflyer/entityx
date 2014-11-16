require('should');
var EntityX = require('../lib/EntityX');
var Factory = require('../lib/Factory');
var path = require('path');

describe('Factory: getRepository', function() {

  beforeEach(function() {
    EntityX._reset();
    EntityX.setApplicationRoot(path.join(__dirname));
    EntityX.addModule('classesTest');
    Factory.reset();
  });

  it('Get driver First time (exists)', function() {
    var driver = Factory.getRepository('TestModule/Inherit');
    (driver._id == null).should.be.true;
  });

  it('Get driver First time (exists)', function() {
    var driver = Factory.getRepository('TestModule/Inherit', 5);
    driver._id.should.be.equal(5);
  });

  it('Get driver second time (exists)', function() {
    var driver1 = Factory.getRepository('TestModule/Inherit', 4);
    var driver2 = Factory.getRepository('TestModule/Inherit', 6);
    driver1._id.should.be.equal(4);
    driver2._id.should.be.equal(6);
  });

  it('Get driver not initialized', function() {
    (function() {
      Factory.getRepository('TestModule2/Inherit', 4);
    }).should.throw('Module [TestModule2] not initialized');
  });
});
