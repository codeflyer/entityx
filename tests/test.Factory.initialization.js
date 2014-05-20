var should = require('should');
var Factory = require('../lib/Factory');
var path = require('path');

describe("Factory: initialization", function() {
    var rootPath = path.join(__dirname, '..');
    beforeEach(function() {
        Factory._reset();
        Factory.reset();
    });

    it("set ApplicationRoot (valid)", function() {
        (function() {
            Factory.setApplicationRoot(rootPath);
        }).should.not.throw();
    });

    it("Set ApplicationRoot (not valid)", function() {
        (function() {
            Factory.setApplicationRoot(rootPath + 'err');
        }).should.throw("ENOENT, no such file or directory '" + rootPath + 'err' + "'");
    });

    it("Get ApplicationRoot", function() {
        (function() {
            Factory.setApplicationRoot(rootPath);
        }).should.not.throw();
        Factory.getApplicationRoot().should.be.equal(rootPath);
    });

    it("Set modulePath (valid)", function() {
        Factory.setApplicationRoot(rootPath);
        Factory.setModule('TestModule', 'tests/classesTest');
        Factory.getModulePath('TestModule').should.be.equal(rootPath + '/tests/classesTest');
    });

    it("Set ModulePath (not valid)", function() {
        Factory.setApplicationRoot(rootPath);
        (function() {
            Factory.setModule('TestModule', 'tests/classesNotValid');
        }).should.throw("ENOENT, no such file or directory '" + rootPath + "/tests/classesNotValid'");
    });

    it("GetModule list (empty)", function() {
        Factory.setApplicationRoot(rootPath);
        Factory.getModules().should.be.eql([]);
    });

    it("GetModule list (not empty)", function() {
        Factory.setApplicationRoot(rootPath);
        Factory.setModule('TestModule', 'tests/classesTest');
        Factory.getModules().should.be.eql(['TestModule']);
    });

    it("Test isModuleSet (false)", function() {
        Factory.setApplicationRoot(rootPath);
        should.strictEqual(Factory.isModuleSet('TestModule'), false);
    });

    it("Test isModuleSet (true)", function() {
        Factory.setApplicationRoot(rootPath);
        Factory.setModule('TestModule', 'tests/classesTest');
        should.strictEqual(Factory.isModuleSet('TestModule'), true);
    });
});