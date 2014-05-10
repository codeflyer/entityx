var should = require('should');
var CoreObjectInherit = require('./../classesTest/lib/entities/CoreObjectInherit');

describe("Object", function() {

    it("Test set/get", function(done) {
        var obj = new CoreObjectInherit();
        obj.setName('pippo');
        should.strictEqual(obj.getName(), 'pippo');
        done();
    });

    it("Test get (not exists)", function(done) {
        var obj = new CoreObjectInherit();
        try {
            obj.getName();
        } catch(e) {
            should.strictEqual(e, 'Key not initialized');
        }
        done();
    });

    it("Test exists", function(done) {
        var obj = new CoreObjectInherit();
        should.strictEqual(obj._keyExists('name'), false);
        obj.setName('pippo');
        should.strictEqual(obj._keyExists('name'), true);
        done();
    });

    it("Test unset", function(done) {
        var obj = new CoreObjectInherit();
        should.strictEqual(obj._keyExists('name'), false);
        obj.setName('pippo');
        should.strictEqual(obj._keyExists('name'), true);
        obj._unset('name');
        should.strictEqual(obj._keyExists('name'), false);
        done();
    });

});