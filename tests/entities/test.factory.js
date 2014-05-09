var should = require('should');
var Factory = require('../../lib/Factory');
var path = require('path');
var MongoClient = require('mongodb').MongoClient;
var connectionManager = require('../../lib/services/ConnectionManager');

describe("core-object: Factory", function() {
    before(function(done) {
        var dbName = "entityxTest";
        fixtures = require('pow-mongodb-fixtures').connect(dbName);
        MongoClient.connect('mongodb://localhost/' + dbName, function(err, db) {
            if(err) {
                throw err;
            }
            connectionManager.addConnection(db);
            done();
        });
    });

    beforeEach(function(done) {
        Factory.reset();
        fixtures.clear(function(err) {
            fixtures.load(__dirname + './../fixtures/users.js', done);
        });
    });


    it("Test set/get ApplicationRoot", function(done) {
        var rootPath = path.join(__dirname, '../..');
        Factory.setApplicationRoot(rootPath);
        should.strictEqual(rootPath, Factory.getApplicationRoot());
        done();
    });

    it("Test set/get modulePath", function(done) {
        var rootPath = path.join(__dirname, '../..');
        Factory.setApplicationRoot(rootPath);
        Factory.setModule('TestModule', 'classesTest');
        should.strictEqual(rootPath + '/classesTest', Factory.getModulePath('TestModule'));
        done();
    });

    it("Test isModuleSet", function(done) {
        var rootPath = path.join(__dirname, '../..');
        Factory.setApplicationRoot(rootPath);
        should.strictEqual(Factory.isModuleSet('TestModule'), false);
        Factory.setModule('TestModule', 'classesTest');
        should.strictEqual(Factory.isModuleSet('TestModule'), true);
        done();
    });

    it("Test getModel (isNew)", function(done) {
        var rootPath = path.join(__dirname, '../..');
        Factory.setApplicationRoot(rootPath);
        Factory.setModule('TestModule', 'tests/classesTest');

        var model = Factory.getModel('TestModule/EntityInherit');
        should.strictEqual(model.isNew(), true);
        done();
    });

    it("Test getModel (isNotNew)", function(done) {
        var rootPath = path.join(__dirname, '../..');
        Factory.setApplicationRoot(rootPath);
        Factory.setModule('TestModule', 'tests/classesTest');

        var model = Factory.getModel('TestModule/EntityInherit', 1);
        should.strictEqual(model.isNew(), false);
        done();
    });

    it("Test getDriver (exists)", function(done) {
        var rootPath = path.join(__dirname, '../..');
        Factory.setApplicationRoot(rootPath);
        Factory.setModule('TestModule', 'tests/classesTest');

        var driver = Factory.getDriver('TestModule/Inherit', 1);
        driver.exists(function(err, exists) {
            should.strictEqual(exists, false);
            done();
        });
    });
});