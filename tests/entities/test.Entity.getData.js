require('should');
var path = require('path');
var Factory = require('../../lib/Factory');
var Entity = require('./../../lib/entities/Entity');

describe("Object: setDataEntity", function() {

    before(function() {
        var rootPath = path.join(__dirname, '../..');
        Factory.setApplicationRoot(rootPath);
        Factory.setModule('TestModule', 'tests/classesTest');

    });

    it("Get data not initialized", function() {
        var obj = new Entity({'useTimestamp' : true});
        obj._isLoad = true;
        (function() {
            obj._getData('entity');
        }).should.throw("Key not initialized");
    });

    it("Get data not loaded initialized", function() {
        var obj = new Entity({'useTimestamp' : true});
        (function() {
            obj._getData('entity');
        }).should.throw("Entity not loaded: need entity.load().then(...)");
    });

    it("Get data with result", function() {
        var obj = new Entity({'useTimestamp' : true});
        obj._isLoad = true;
        obj._data.test = 100;
        obj._getData('test').should.be.equal(100);
        obj._data.test = 200;
        obj._getData('test').should.be.equal(200);
    });

});