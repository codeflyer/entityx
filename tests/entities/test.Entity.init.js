require('should');
var Entity = require('./../../lib/entities/Entity');

describe("Entity: Init", function() {
    it("Identifier null", function() {
        var entity = new Entity({});
        (function() {
            entity._init();
        }).should.throw('Identifier not valid');
    });

    it("Identifier valid", function() {
        var entity = new Entity({});
        entity._init(1);
        entity._isNew.should.be.false;
        entity._id.should.be.equal(1);
        (entity._preloadDetails == null).should.be.true;
    });

    it("Identifier valid, with preloading", function() {
        var entity = new Entity({});
        entity._init(1, {'name' : 'test'});
        entity._isNew.should.be.false;
        entity._id.should.be.equal(1);
        entity._preloadDetails.should.be.eql({'name' : 'test'});
    });
});