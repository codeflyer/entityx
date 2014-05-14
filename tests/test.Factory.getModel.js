var Factory = require('../lib/Factory');
var path = require('path');
var ObjectID = require('mongodb').ObjectID;

var sinon = require('sinon');
require('should');


describe("Factory: getModel", function() {
    beforeEach(function() {
        Factory.reset();
    });

    it("Get model First time (exists)", function() {
        var rootPath = path.join(__dirname, '..');
        Factory.setApplicationRoot(rootPath);
        Factory.setModule('TestModule', 'tests/classesTest');

        var mock = sinon.mock(Factory);
        mock.expects("isModuleSet").once().withArgs('TestModule');
        mock.expects("getModulePath").once().withArgs('TestModule');
        Factory.getModel('TestModule/EntityInherit');
        Factory.isModuleSet.restore();
        Factory.getModulePath.restore();
    });

    it("Get model First time (module not init not exists)", function() {
        var rootPath = path.join(__dirname, '..');
        Factory.setApplicationRoot(rootPath);
        Factory.setModule('TestModule', 'tests/classesTest');

        var mock = sinon.mock(Factory);
        mock.expects("isModuleSet").once().withArgs('TestModule');
        mock.expects("getModulePath").never();
        (function() {
            Factory.getModel('TestModule/EntityInherit2');
        }).should.throw("Module [TestModule] not initialized");
        Factory.isModuleSet.restore();
        Factory.getModulePath.restore();
    });

    it("Get model Second time", function() {
        var rootPath = path.join(__dirname, '..');
        Factory.setApplicationRoot(rootPath);
        Factory.setModule('TestModule', 'tests/classesTest');

        var mock = sinon.mock(Factory);
        mock.expects("isModuleSet").once().withArgs('TestModule');
        mock.expects("getModulePath").once().withArgs('TestModule');
        Factory.getModel('TestModule/EntityInherit');

        Factory.getModel('TestModule/EntityInherit');


        Factory.isModuleSet.restore();
        Factory.getModulePath.restore();
    });


    it("Get model not init", function() {
        var rootPath = path.join(__dirname, '..');
        Factory.setApplicationRoot(rootPath);
        Factory.setModule('TestModule', 'tests/classesTest');

        var mock = sinon.mock(Factory);
        mock.expects("isModuleSet").once().withArgs('TestModule');
        mock.expects("getModulePath").once().withArgs('TestModule');
        var model = Factory.getModel('TestModule/EntityInherit');
        (model._id == null).should.be.true;
        Factory.isModuleSet.restore();
        Factory.getModulePath.restore();
    });

    it("Get model not init scalar", function() {
        var rootPath = path.join(__dirname, '..');
        Factory.setApplicationRoot(rootPath);
        Factory.setModule('TestModule', 'tests/classesTest');

        var mock = sinon.mock(Factory);
        mock.expects("isModuleSet").once().withArgs('TestModule');
        mock.expects("getModulePath").once().withArgs('TestModule');
        var model = Factory.getModel('TestModule/EntityInherit', 5);
        model._id.should.be.equal(5);
        Factory.isModuleSet.restore();
        Factory.getModulePath.restore();
    });

    it("Get model not init ObjectId", function() {
        var rootPath = path.join(__dirname, '..');
        Factory.setApplicationRoot(rootPath);
        Factory.setModule('TestModule', 'tests/classesTest');


        var mock = sinon.mock(Factory);
        mock.expects("isModuleSet").once().withArgs('TestModule');
        mock.expects("getModulePath").once().withArgs('TestModule');

        var newId = new ObjectID();
        var model = Factory.getModel('TestModule/EntityInherit', newId);

        model._id.should.be.equal(newId.toString());
        Factory.isModuleSet.restore();
        Factory.getModulePath.restore();
    });

    it("Get model with preload", function() {
        var rootPath = path.join(__dirname, '..');
        Factory.setApplicationRoot(rootPath);
        Factory.setModule('TestModule', 'tests/classesTest');


        var mock = sinon.mock(Factory);
        mock.expects("isModuleSet").once().withArgs('TestModule');
        mock.expects("getModulePath").once().withArgs('TestModule');

        var struct = {'name' : 'davide', 'surname' : 'fiorello'};
        var model = Factory.getModel('TestModule/EntityInherit', 5, struct);

        model._preloadDetails.should.be.eql(struct);
        Factory.isModuleSet.restore();
        Factory.getModulePath.restore();
    });

    it("Get model with NO preload", function() {
        var rootPath = path.join(__dirname, '..');
        Factory.setApplicationRoot(rootPath);
        Factory.setModule('TestModule', 'tests/classesTest');


        var mock = sinon.mock(Factory);
        mock.expects("isModuleSet").once().withArgs('TestModule');
        mock.expects("getModulePath").once().withArgs('TestModule');

        var model = Factory.getModel('TestModule/EntityInherit', 5);

        (model._preloadDetails == null).should.be.true;
        Factory.isModuleSet.restore();
        Factory.getModulePath.restore();
    });
});