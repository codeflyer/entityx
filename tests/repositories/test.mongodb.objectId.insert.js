require('should');
var ObjectID = require('mongodb').ObjectID;
var MongoDBObjectID = require('./../../lib/repositories/MongoDBObjectID');
var MongoClient = require('mongodb').MongoClient;
var connectionManager = require('../../lib/services/ConnectionManager');

describe("Repositories, MongoDBObjectID: Insert", function() {

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
            done();
        });
    });

    it("Insert new", function(done) {
        var driver = new MongoDBObjectID({'collectionName' : 'coll_name'}, null);
        driver.insert({'test' : 'foo'}, function(err, doc){
            doc._id.should.be.instanceOf(ObjectID);
            doc.test.should.be.equal('foo');
            (doc._ts == null).should.be.true;
            done();
        });
    });

    it("Insert new with timestamp", function(done) {
        var driver = new MongoDBObjectID({'collectionName' : 'coll_name', 'useTimestamp' : true}, null);
        driver.insert({'test' : 'foo'}, function(err, doc){
            doc._id.should.be.instanceOf(ObjectID);
            doc.test.should.be.equal('foo');
            doc._ts.created.should.exists;
            doc._ts.modified.should.exists;
            (doc._ts.deleted == null).should.be.true;
            done();
        });
    });
});