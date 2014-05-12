require('should');
var path = require('path');
var Factory = require('../../lib/Factory');
var CoreObject = require('./../../lib/entities/CoreObject');

describe("Object: setDataEntity", function() {

    before(function() {
        var rootPath = path.join(__dirname, '../..');
        Factory.setApplicationRoot(rootPath);
        Factory.setModule('TestModule', 'tests/classesTest');

    });

    it("Get data not initialized", function() {
        var obj = new CoreObject();
        (function() {
            obj._getData('entity');
        }).should.throw("Key not initialized");
    });

    it("Get data with result", function() {
        var obj = new CoreObject();
        obj._data.test = 100;
        obj._getData('test').should.be.equal(100);
        obj._data.test = 200;
        obj._getData('test').should.be.equal(200);
    });


});