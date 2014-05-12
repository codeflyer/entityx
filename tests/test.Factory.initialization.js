var should = require('should');
var Factory = require('../lib/Factory');
var path = require('path');

describe("Factory: initialization", function() {
    beforeEach(function() {
        Factory.reset();
    });

    it("set ApplicationRoot (valid)", function() {
        var rootPath = path.join(__dirname, '..');
        (function() {
            Factory.setApplicationRoot(rootPath);
        }).should.not.throw();
    });

    it("Set ApplicationRoot (not valid)", function() {
        var rootPath = path.join(__dirname, '..');
        rootPath += 'err';
        (function() {
            Factory.setApplicationRoot(rootPath);
        }).should.throw("ENOENT, no such file or directory '" + rootPath + "'");
    });

    it("Get ApplicationRoot", function() {
        var rootPath = path.join(__dirname, '..');
        (function() {
            Factory.setApplicationRoot(rootPath);
        }).should.not.throw();
        Factory.getApplicationRoot().should.be.equal(rootPath);
    });

    it("Set modulePath (valid)", function() {
        var rootPath = path.join(__dirname, '..');
        Factory.setApplicationRoot(rootPath);
        Factory.setModule('TestModule', 'tests/classesTest');
        Factory.getModulePath('TestModule').should.be.equal(rootPath + '/tests/classesTest');
    });

    it("Set ModulePath (not valid)", function() {
        var rootPath = path.join(__dirname, '..');
        Factory.setApplicationRoot(rootPath);
        (function() {
            Factory.setModule('TestModule', 'tests/classesNotValid');
        }).should.throw("ENOENT, no such file or directory '" + rootPath + "/tests/classesNotValid'");
    });

    it("GetModule list (empty)", function() {
        var rootPath = path.join(__dirname, '..');
        Factory.setApplicationRoot(rootPath);
        Factory.getModules().should.be.eql([]);
    });

    it("GetModule list (not empty)", function() {
        var rootPath = path.join(__dirname, '..');
        Factory.setApplicationRoot(rootPath);
        Factory.setModule('TestModule', 'tests/classesTest');
        Factory.getModules().should.be.eql(['TestModule']);
    });

    it("Test isModuleSet (false)", function() {
        var rootPath = path.join(__dirname, '..');
        Factory.setApplicationRoot(rootPath);
        should.strictEqual(Factory.isModuleSet('TestModule'), false);
    });

    it("Test isModuleSet (true)", function() {
        var rootPath = path.join(__dirname, '..');
        Factory.setApplicationRoot(rootPath);
        Factory.setModule('TestModule', 'tests/classesTest');
        should.strictEqual(Factory.isModuleSet('TestModule'), true);
    });
});