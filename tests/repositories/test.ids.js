var should = require('should');

var MongoDBDriver = require('./../../lib/repositories/MongoDB');

var ObjectID = require('mongodb').ObjectID;
var MongoClient = require('mongodb').MongoClient;
var async = require('async');
var connectionManager = require('../../lib/services/ConnectionManager');

describe("MongoDbDriver: Ids", function() {
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
        fixtures.clear(function() {
            fixtures.load(__dirname + './../fixtures/driverObjectIds.js', done);
        });
    });

    /*
    it("Pass id to constructor and check getId value", function() {
        var tempId = new ObjectID('123456789012');
        var driver = new MongoDBDriver(tempId.toString());
        driver.useObjectId = true;
        var id = driver.getId();
        id.should.be.an.instanceOf(ObjectID);
        id.toString().should.be.equal(tempId.toString());
    });

    it("setId", function() {
        var tempId = new ObjectID('123456789012');
        var driver = new MongoDBDriver(tempId.toString());
        driver.useObjectId = false;
        var id = driver.getId();
        id.should.be.an.instanceOf(ObjectID);
        id.toString().should.be.equal(tempId.toString());
    });
    */
});