require('should');
var Factory = require('../lib/Factory');
var path = require('path');



describe("Factory: getDriver", function() {
    beforeEach(function() {
        Factory.reset();
    });

    it("Get driver First time (exists)", function() {
        var rootPath = path.join(__dirname, '..');
        Factory.setApplicationRoot(rootPath);
        Factory.setModule('TestModule', 'tests/classesTest');
        var driver = Factory.getDriver('TestModule/Inherit');
        (driver._id == null).should.be.true;
    });

    it("Get driver First time (exists)", function() {
        var rootPath = path.join(__dirname, '..');
        Factory.setApplicationRoot(rootPath);
        Factory.setModule('TestModule', 'tests/classesTest');
        var driver = Factory.getDriver('TestModule/Inherit', 5);
        driver._id.should.be.equal(5);
    });

    it("Get driver second time (exists)", function() {
        var rootPath = path.join(__dirname, '..');
        Factory.setApplicationRoot(rootPath);
        Factory.setModule('TestModule', 'tests/classesTest');
        var driver1 = Factory.getDriver('TestModule/Inherit', 4);
        var driver2 = Factory.getDriver('TestModule/Inherit', 6);
        driver1._id.should.be.equal(4);
        driver2._id.should.be.equal(6);
    });

    it("Get driver not initialized", function() {
        var rootPath = path.join(__dirname, '..');
        Factory.setApplicationRoot(rootPath);
        (function() {
            Factory.getDriver('TestModule2/Inherit', 4);
        }).should.throw('Module [TestModule2] not initialized');
    });
});