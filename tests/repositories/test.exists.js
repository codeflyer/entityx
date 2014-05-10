var should = require('should');
var InheritDriver = require('./../classesTest/lib/repositories/InheritDriver');
var InheritNoTsDriver = require('./../classesTest/lib/repositories/InheritNoTsDriver');
var MongoClient = require('mongodb').MongoClient;
var connectionManager = require('../../lib/services/ConnectionManager');

describe("Driver Exists", function() {
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
            fixtures.load(__dirname + './../fixtures/driverNoTs.js', function() {
                fixtures.load(__dirname + './../fixtures/driverTs.js', done);
            });
        });
    });

    it("Test exists Ts", function(done) {
        var driver = new InheritDriver(1);
        driver.exists(function(err, result) {
                if(err) {
                    done(err);
                }
                should.strictEqual(result, true);
                done();
            }
        );
    });

    it("Test not exists Ts (removed)", function(done) {
        var driver = new InheritDriver(3);
        driver.exists(function(err, result) {
                if(err) {
                    done(err);
                }
                should.strictEqual(result, false);
                done();
            }
        );
    });

    it("Test not exists Ts (never existed)", function(done) {
        var driver = new InheritDriver(4);
        driver.exists(function(err, result) {
                if(err) {
                    done(err);
                }
                should.strictEqual(result, false);
                done();
            }
        );
    });

    it("Test exists NoTs", function(done) {
        var driver = new InheritNoTsDriver(1);
        driver.exists(function(err, result) {
                if(err) {
                    done(err);
                }
                should.strictEqual(result, true);
                done();
            }
        );
    });

    it("Test not exists No Ts (never existed)", function(done) {
        var driver = new InheritNoTsDriver(4);
        driver.exists(function(err, result) {
                if(err) {
                    done(err);
                }
                should.strictEqual(result, false);
                done();
            }
        );
    });
});