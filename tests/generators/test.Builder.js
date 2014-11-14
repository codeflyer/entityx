var should = require('should');
var util = require("util");
var Entity = require('../../lib/entities/Entity');
var Builder = require('../../lib/generators/Builder');

describe.only("generators/Builder", function () {

    it("BuildSimpleClass (get/set)", function (done) {
        var define = require('../structs/simple.json');
        function Simple() {
            Entity.call(this, {'useTimestamp': true});
        }
        util.inherits(Simple, Entity);

        Builder.build(Simple, define);

        var instance = new Simple();
        instance._isLoad = true;
        instance._setData('field1', 'hello');
        instance.getField1().then(function (result) {
            result.should.be.equal('hello');
            instance.setField1('world');
            instance.getField1Sync().should.be.equal('world');
            done();
        });
    });

    it("BuildSimpleClass (load)", function (done) {
        var define = require('../structs/simple.json');

        function Simple() {
            Entity.call(this, {'useTimestamp': true});
        }

        util.inherits(Simple, Entity);

        Builder.build(Simple, define);

        var instance = new Simple();
        instance.load({'field1': 'hello'}).then(function (result) {
            return instance.getField1();
        }).then(function (result) {
                try {
                    result.should.be.equal('hello');
                    done();
                } catch(e) {done(e)}
        }).catch(function (e) {
            done(e);
        });
    });
});