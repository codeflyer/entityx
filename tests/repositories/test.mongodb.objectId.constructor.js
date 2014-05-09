require('should');
var sinon = require('sinon');
var ObjectID = require('mongodb').ObjectID;

var MongoDB = require('./../../lib/repositories/MongoDB');
var MongoDBSequence = require('./../../lib/repositories/MongoDBObjectID');

describe("Repositories, MongoDBObjectID: Constructor", function() {


    it("Empty params in constructor", function() {
        (function() {
            new MongoDBSequence()
        }).should.throw("Driver initialization require params");
    });

    it("Check if params pass to parent", function() {
        var driver = new MongoDBSequence({'collectionName' : 'coll_name'});
        driver.collectionName.should.equal('coll_name');
    });

    it("Identifier null", function() {
        var driver = new MongoDBSequence({'collectionName' : 'coll_name'}, null);
        (driver.getId() === null).should.be.true;
    });

    it("Identifier string (not valid)", function() {
        var driver = new MongoDBSequence({'collectionName' : 'coll_name'}, 'hello');
        (driver.getId() === null).should.be.true;
    });

    it("Identifier integer", function() {
        var driver = new MongoDBSequence({'collectionName' : 'coll_name'}, 10);
        (driver.getId() === null).should.be.true;
    });

    it("Identifier ObjectID", function() {
        var driver = new MongoDBSequence({'collectionName' : 'coll_name'}, new ObjectID());
        driver.getId().should.be.instanceOf(ObjectID);
    });
});