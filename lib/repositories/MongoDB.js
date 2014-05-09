/**
 * ClemPlanet
 *
 * Base class driver
 *
 * @author Davide Fiorello <davide@codeflyer.com>
 */
var connectionManager = require('../services/ConnectionManager');

/**
 *
 */
var MongoDBDriver = function(params) {
    if(params == null) {
        throw new Error("Driver initialization require params");
    }

    if(params != null && params['useTimestamp'] != null && params['useTimestamp'] === true) {
        this.useTimestamp = true;
    } else {
        this.useTimestamp = false;
    }
    if(params['collectionName'] == null) {
        throw new Error("Collection Name not defined");
    } else if(typeof params['collectionName'] !== 'string' || params['collectionName'].length == 0) {
        throw new Error("Collection Name not valid");
    } else {
        this.collectionName = params['collectionName'];
    }
    this._id = null
};

/**
 * Get the ID of driver
 * @returns {*}
 */
MongoDBDriver.prototype.getId = function() {
    return this._id;
};

/**
 * Set the driver identifier
 * @returns {*}
 */
MongoDBDriver.prototype.setId = function(id) {
    this._id = id;
};

/**
 * Check if the driver is initialized (with an id)
 * @returns {boolean}
 */
MongoDBDriver.prototype.isInit = function() {
    return this._id !== null;
};

/**
 * Get the connectionObject
 * @returns {*}
 */
MongoDBDriver.prototype.getConnection = function() {
    return connectionManager.getConnection();
};

/**
 * Get a collection by name
 * @param collectionName
 * @returns {*}
 */
MongoDBDriver.prototype.getCollection = function(collectionName) {
    if(collectionName == null) {
        collectionName = this.collectionName;
    }
    return this.getConnection().collection(collectionName);
};

/**
 * Load the entity referred to ID
 * @param next
 */
MongoDBDriver.prototype.loadEntity = function(next) {
    if(!this.isInit()) {
        return next('Driver not initialized');
    }
    this.getCollection(this.collectionName).findOne({
        '_id' : this._id
    }, function(err, doc) {
        if(err) {
            return next(err);
        }
        next(null, doc);
    });
};

/**
 * Retrieve the first object that relay to query
 * @param query
 * @param projection
 * @param next
 */
MongoDBDriver.prototype.loadOneBy = function() {
    var query, projection;
    var next = arguments[arguments.length - 1];
    query = arguments[0];
    if(arguments.length === 3) {
        projection = arguments[1];
    } else {
        projection = {};
    }
    if(this.useTimestamp) {
        query['_ts.deleted'] = null;
    }

    this.getCollection(this.collectionName).findOne(
        query,
        projection,
        function(err, doc) {
            if(err) {
                return next(err);
            }
            next(null, doc);
        });
};

/**
 * Retrieve the objects that relay to query
 * @param query
 * @param projection
 * @param next
 */
MongoDBDriver.prototype.loadBy = function() {
    var query, projection;
    var next = arguments[arguments.length - 1];
    query = arguments[0];
    if(arguments.length === 3) {
        projection = arguments[1];
    } else {
        projection = {};
    }
    if(this.useTimestamp) {
        query['_ts.deleted'] = null;
    }

    this.getCollection(this.collectionName).find(
        query,
        projection
    ).toArray(
        function(err, docs) {
            if(err) {
                return next(err);
            }
            if(docs == null) {
                return next(null, []);
            }

            next(null, docs);
        });
};

MongoDBDriver.prototype.exists = function(next) {
    if(!this.isInit()) {
        return next('Driver not initialized');
    }
    var query;
    if(this.useTimestamp) {
        query = {'_id' : this._id, '_ts.deleted' : null};
    } else {
        query = {'_id' : this._id};
    }
    this.getCollection(this.collectionName).findOne(
        query,
        {'_id' : 1},
        function(err, doc) {
            if(err) {
                return next(err);
            }
            if(doc == null) {
                next(null, false);
            } else {
                next(null, true);
            }
        });
};

/**
 * Remove an element from the database or set the field _ts.deleted
 * @param permanent
 * @param next
 */
MongoDBDriver.prototype.delete = function(permanent, next) {
    if(!this.isInit()) {
        return next('Driver not initialized');
    }
    if(arguments.length === 1) {
        next = arguments[arguments.length - 1];
        permanent = false;
    } else if(permanent == null) {
        permanent = false;
    }
    if(this.useTimestamp && !permanent) {
        this.getCollection(this.collectionName).update({
                '_id' : this._id
            }, {
                $set : {'_ts.deleted' : new Date()}
            },
            {'w' : 1}, function(err) {
                if(err) {
                    return next(err);
                }
                next(null, true);
            });
    } else {
        this.getCollection(this.collectionName).remove({
            '_id' : this._id
        }, {'w' : 1}, function(err) {
            if(err) {
                return next(err);
            }
            next(null, true);
        });
    }
};

MongoDBDriver.prototype.update = function(data, next) {
    if(!this.isInit()) {
        return next('Driver not initialized');
    }

    if(this.useTimestamp) {
        data._ts = {
            modified : new Date()
        };
    }
    this.getCollection(this.collectionName).update({'_id' : this._id}, {$set : data}, function(err, doc) {
        if(err) {
            return next(err);
        }
        next(null, doc);
    });
};

module.exports = MongoDBDriver;