var util = require("util");
var Q = require('q');
var async = require('async');
var CoreObject = require('./CoreObject');
var ValueObject = require('./ValueObject');

var Entity = function(params, id) {
    CoreObject.call(this);

    if(params == null) {
        throw new Error("Entity initialization require params");
    }

    if(params != null && params['useTimestamp'] != null && params['useTimestamp'] === true) {
        this._useTimestamp = true;
    } else {
        this._useTimestamp = false;
    }

    this._isNewObject = true;
    this._isLoad = false;
    this._preloadDetails = null;
};
util.inherits(Entity, CoreObject);

/**
 * Check if the entity use the timestamp
 * @return {boolean|*}
 */
Entity.prototype.useTimestamp = function() {
    return this._useTimestamp;
};

/**
 * Init the entity
 * @param id
 * @param details
 * @private
 */
Entity.prototype._init = function(id, details) {
    if(id == null) {
        throw new Error('Identifier not valid');
    }
    this._isNewObject = false;
    this._id = id;
    if(details != null) {
        this._preloadDetails = details;
    }
};

/**
 * Get value
 * @param {String} key
 * @returns {*}
 * @protected
 */
Entity.prototype._getDataForSave = function(key) {
    var data = this._getData(key);
    if(data instanceof Entity) {
        return {'_id' : data._id};
    }
    if(data instanceof ValueObject) {
        return data._data;
    }
    return data;
};

Entity.prototype.isNewObject = function() {
    return this._isNewObject;
};

Entity.prototype.isLoad = function() {
    return this._isLoad;
};

Entity.prototype.getId = function() {
    return this._id;
};

/**
 * Retrieve data fot the class
 * @param key
 * @return {*}
 * @private
 */
Entity.prototype._getData = function(key) {
    if(this._isLoad == false) {
        throw new Error("Entity not loaded: need entity.load().then(...)");
    }
    return Entity.super_.prototype._getData.call(this, key);
};

/**
 * Check if an object is the same
 * @returns {boolean}
 */
Entity.prototype.equal = function(object) {
    if(object == null) {
        return false;
    }
    return (object.constructor === this.constructor && this.getId() === object.getId());
};

/**
 * Verify the existence of the entity
 * @returns {promise}
 */
Entity.prototype.existsCallback = function(callback) {
    this.exists().then(
        function(result) {
            callback(null, result);
        },
        function(error) {
            callback(error);
        }
    );
};

/**
 * Verify the existence of the entity
 * @returns {promise}
 */
Entity.prototype.exists = function() {
    var deferred = Q.defer();
    this._getDriver().exists(
        function(err, result) {
            if(err) {
                deferred.reject(err);
            }
            deferred.resolve(result);
        }
    );
    return deferred.promise;
};


/**
 * Verify the existence of the entity
 * @returns {promise}
 */
Entity.prototype.deleteCallback = function(permanent, callback) {
    this.delete(permanent).then(
        function(result) {
            callback(null, result);
        },
        function(error) {
            callback(error);
        }
    );
};

/**
 * Delete the entity
 * @returns {promise}
 */
Entity.prototype.delete = function(permanent) {
    if(permanent == null) {
        permanent = false;
    }
    var deferred = Q.defer();
    this._getDriver().delete(permanent,
        function(err, result) {
            if(err) {
                deferred.reject(err);
            }
            deferred.resolve(result);
        }
    );
    return deferred.promise;
};


Entity.prototype.loadCallback = function(details, callback) {
    this.load(details).then(
        function(result) {
            callback(null, result);
        },
        function(error) {
            callback(error);
        }
    );
};

Entity.prototype.load = function(details) {
    var deferred = Q.defer();
    this._internalLoadDetails(details).then(
        function(that) {
            deferred.resolve(that);
        },
        function(error) {
            deferred.reject(error);
        }
    );
    return deferred.promise;
};

Entity.prototype.storeFieldsCallback = function(fieldList, callback) {
    this.storeFields(fieldList).then(
        function(result) {
            callback(null, result);
        },
        function(error) {
            callback(error);
        }
    );
};

/**
 *
 * @param fieldList
 * @param next
 * @returns {*}
 */
Entity.prototype.storeFields = function(fieldList, next) {
    var deferred = Q.defer();
    var dataToUpdate = {};
    var that = this;
    fieldList.forEach(function(element, index) {
        dataToUpdate[element] = that._getDataForSave(element);
    });

    this._getDriver().update(
        dataToUpdate,
        function(err, result) {
            if(err) {
                return deferred.reject(err);
            }
            return deferred.resolve(result);
        }
    );
    return deferred.promise;
};
/**
 *
 * @param details
 * @private
 */
Entity.prototype._internalLoadDetails = function(details) {
    var deferred = Q.defer();
    if(this._isLoad) {
        deferred.resolve(that);
    } else {
        var that = this;
        async.waterfall(
            [
                function(callback) {
                    if(details == null) {
                        if(that._preloadDetails != null) {
                            var tmpDetails = that._preloadDetails;
                            that._preloadDetails = null;
                            return callback(null, tmpDetails);
                        }
                        that._getDriver().loadEntity(function(err, result) {
                            if(err) {
                                return callback(new Error(err, 2));
                            }
                            callback(null, result);
                        });
                    } else {
                        callback(null, details);
                    }
                },
                function(details, callback) {
                    if(details == null) {
                        return callback(new Error("Entity not exists", 1));
                    }
                    // load detail specifica per ogni Entity
                    that._loadDetails(details, function() {
                        callback(null, details);
                    });
                },
                function(details, callback) {
                    if(that.useTimestamp()) {
                        that._setData('ts', details._ts);
                    }
                    callback();
                }
            ],
            function(err) {
                if(err) {
                    return deferred.reject(err);
                }
                that._isLoad = true;
                deferred.resolve(that);
            }
        );
    }
    return deferred.promise;
};


module.exports = Entity;