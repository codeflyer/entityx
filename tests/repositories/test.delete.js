var should = require('should');
var InheritDriver = require('./../classesTest/lib/repositories/InheritDriver');
var InheritNoTsDriver = require('./../classesTest/lib/repositories/InheritNoTsDriver');
var MongoClient = require('mongodb').MongoClient;
var async = require('async');
var connectionManager = require('../../lib/services/ConnectionManager');

describe("Driver operation: Delete", function() {
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

    it("Test delete noTS", function(done) {
        async.series([
            function(callback) {
                var driver = new InheritNoTsDriver(1);
                driver.exists(function(err, result) {
                        if(err) {
                            return callback(err);
                        }
                        should.strictEqual(result, true);
                        callback();
                    }
                );
            },
            function(callback) {
                var driver = new InheritNoTsDriver(1);
                driver.delete(function(err) {
                        if(err) {
                            return callback(err);
                        }
                        callback();
                    }
                );
            },
            function(callback) {
                var driver = new InheritNoTsDriver(1);
                driver.exists(function(err, result) {
                        if(err) {
                            return callback(err);
                        }
                        should.strictEqual(result, false);
                        callback();
                    }
                );
            },
            function(callback) {
                var driver = new InheritNoTsDriver(1);
                driver.getCollection(driver.collectionName).findOne({'_id' : 1}, function(err, result) {
                        if(err) {
                            return callback(err);
                        }
                        should.strictEqual(result, null);
                        callback();
                    }
                );
            }

        ], function(err) {
            if(err) {
                return done(err);
            }
            done();
        });
    });

    it("Test delete TS", function(done) {
        async.series([
            function(callback) {
                var driver = new InheritDriver(1);
                driver.exists(function(err, result) {
                        if(err) {
                            return callback(err);
                        }
                        should.strictEqual(result, true);
                        callback();
                    }
                );
            },
            function(callback) {
                var driver = new InheritDriver(1);
                driver.delete(function(err, result) {
                        if(err) {
                            return callback(err);
                        }
                        callback();
                    }
                );
            },
            function(callback) {
                var driver = new InheritDriver(1);
                driver.exists(function(err, result) {
                        if(err) {
                            return callback(err);
                        }
                        should.strictEqual(result, false);
                        callback();
                    }
                );
            },
            function(callback) {
                var driver = new InheritDriver(1);
                driver.getCollection(driver.collectionName).findOne({'_id' : 1},
                    function(err, result) {
                        if(err) {
                            return callback(err);
                        }
                        should.notStrictEqual(result, null);
                        callback();
                    }
                );
            }
        ], function(err, result) {
            if(err) {
                return done(err);
            }
            done();
        });
    });
});