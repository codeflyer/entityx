require('should');
var MongoDBDriver = require('./../../lib/repositories/MongoDB');

describe("Repositories, MongoDB: Constructor", function() {


    it("Empty params in constructor", function() {
        (function() {
            new MongoDBDriver();
        }).should.throw("Driver initialization require params");
    });

    it("Wrong param in constructor", function() {
        (function() {
            new MongoDBDriver('');
        }).should.throw("Collection Name not defined");
    });

    it("CollectionName param missing", function() {
        (function() {
            new MongoDBDriver({'useTimestamp' : true});
        }).should.throw("Collection Name not defined");
    });

    it("CollectionName param not valid (length == 0)", function() {
        (function() {
            new MongoDBDriver({'useTimestamp' : true, 'collectionName' : ''});
        }).should.throw("Collection Name not valid");
    });

    it("CollectionName param not valid (!= string)", function() {
        (function() {
            new MongoDBDriver({'useTimestamp' : true, 'collectionName' : 1});
        }).should.throw("Collection Name not valid");
    });

    it("useTimestamp true", function() {
        var driver = null;
        (function() {
            driver = new MongoDBDriver({'useTimestamp' : true, 'collectionName' : 'coll_name'});
        }).should.not.throw();

        driver.useTimestamp.should.equal(true);
    });

    it("useTimestamp missing", function() {
        var driver = null;
        (function() {
            driver = new MongoDBDriver({'collectionName' : 'coll_name'});
        }).should.not.throw();

        driver.useTimestamp.should.equal(false);
    });

    it("useTimestamp false", function() {
        var driver = null;
        (function() {
            driver = new MongoDBDriver({'useTimestamp' : false, 'collectionName' : 'coll_name'});
        }).should.not.throw();

        driver.useTimestamp.should.equal(false);
    });

    it("init collection name", function() {
        var driver = new MongoDBDriver({'collectionName' : 'coll_name'});
        driver.collectionName.should.equal('coll_name');
    });



    it("id == null", function() {
        var driver = null;
        (function() {
            driver = new MongoDBDriver({'useTimestamp' : false, 'collectionName' : 'coll_name'});
        }).should.not.throw();

        (driver._id === null).should.be.true;

    });
});