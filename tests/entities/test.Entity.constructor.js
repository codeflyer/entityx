require('should');
var Entity = require('./../../lib/entities/Entity');

describe("Entity: Constructor", function() {

    it("Empty params in constructor", function() {
        (function() {
            new Entity();
        }).should.throw("Entity initialization require params");
    });

    it("useTimestamp true", function() {
        var entity = null;
        (function() {
            entity = new Entity({'useTimestamp' : true});
        }).should.not.throw();

        entity._useTimestamp.should.equal(true);
    });

    it("useTimestamp missing", function() {
        var entity = null;
        (function() {
            entity = new Entity({});
        }).should.not.throw();

        entity._useTimestamp.should.equal(false);
    });

    it("useTimestamp false", function() {
        var entity = null;
        (function() {
            entity = new Entity({'useTimestamp' : false});
        }).should.not.throw();

        entity._useTimestamp.should.equal(false);
    });

    it("useTimestamp() false", function() {
        var entity = new Entity({'useTimestamp' : false});
        entity.useTimestamp().should.equal(false);
    });

    it("useTimestamp() true", function() {
        var entity = new Entity({'useTimestamp' : true});
        entity.useTimestamp().should.equal(true);
    });

/*

    it("id == null", function() {
        var driver = null;
        (function() {
            driver = new MongoDBDriver({'useTimestamp' : false, 'collectionName' : 'coll_name'});
        }).should.not.throw();

        (driver._id === null).should.be.true;

    });
    */
});