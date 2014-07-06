require('should');
var ObjectID = require('mongodb').ObjectID;
var MongoDBInner = require('./../../lib/repositories/MongoDBInner');

describe("Repositories, MongoDBInner: Constructor", function() {


    it("Empty params in constructor", function() {
        (function() {
            new MongoDBInner();
        }).should.throw("Driver initialization require params");
    });

    it("Inner field name not defined", function() {
        (function() {
            new MongoDBInner({'collectionName' : 'coll_name'});
        }).should.throw('Inner field Name not defined');
    });

    it("Inner field name not valid", function() {
        (function() {
            new MongoDBInner({'collectionName' : 'coll_name', 'innerFieldName' : ''});
        }).should.throw('Inner field Name not valid');
    });

    it("Check if params pass to parent and innerFieldName is defined", function() {
        var driver = new MongoDBInner({'collectionName' : 'coll_name', 'innerFieldName' : 'list'});
        driver.collectionName.should.equal('coll_name');
        driver.innerFieldName.should.equal('list');
    });

    it("Identifier null", function() {
        var driver = new MongoDBInner({'collectionName' : 'coll_name', 'innerFieldName' : 'list'}, null);
        (driver.getId() === null).should.be.true;
    });

    it("Identifier negative", function() {
        var driver = new MongoDBInner({'collectionName' : 'coll_name', 'innerFieldName' : 'list'}, -10);
        (driver.getId() === null).should.be.true;
    });

    it("Identifier string (not valid)", function() {
        var driver = new MongoDBInner({'collectionName' : 'coll_name', 'innerFieldName' : 'list'}, 'hello');
        (driver.getId() === null).should.be.true;
    });

    it("Identifier ObjectID (not valid)", function() {
        var driver = new MongoDBInner({'collectionName' : 'coll_name', 'innerFieldName' : 'list'}, new ObjectID());
        (driver.getId() === null).should.be.true;
    });

    it("Identifier OK", function() {
        var driver = new MongoDBInner({'collectionName' : 'coll_name', 'innerFieldName' : 'list'}, 10);
        driver.getId().should.be.equal(10);
    });

});