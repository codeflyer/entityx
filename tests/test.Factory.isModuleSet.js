var Factory = require('../lib/Factory');
var path = require('path');
require('should');


describe("Factory: isModuleSet", function() {
    var rootPath = path.join(__dirname, '..');

    beforeEach(function() {
    });

    afterEach(function() {
    });

    beforeEach(function() {
        Factory._reset();
        Factory.reset();
        Factory.setApplicationRoot(rootPath);
    });

    it("Get module without initialization", function() {
        Factory.isModuleSet('TestModule').should.be.false;
    });

    it("Get module with initialization", function() {
        Factory.setModule('TestModule', 'tests/classesTest');
        Factory.isModuleSet('TestModule').should.be.true;
    });

    it("Get module after reset ", function() {
        Factory.setModule('TestModule', 'tests/classesTest');
        Factory.reset();
        Factory.isModuleSet('TestModule').should.be.true;
    });
});