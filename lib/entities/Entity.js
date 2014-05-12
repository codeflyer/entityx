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

    this._isNew = true;
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
    this._isNew = false;
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

Entity.prototype.isNew = function() {
    return this._isNew;
};

Entity.prototype.isLoad = function() {
    return this._isLoad;
};

Entity.prototype.getId = function() {
    return this._id;
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
                            callback(null, tmpDetails);
                        }
                        that._getDriver().loadEntity(function(err, result) {
                            if(err) {
                                callback(err);
                            }
                            callback(null, result);
                        });
                    } else {
                        callback(null, details);
                    }
                },
                function(details, callback) {
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
                    deferred.reject('Errore');
                } else {
                    that._isLoad = true;
                    deferred.resolve(that);
                }
            }
        );
    }
    return deferred.promise;
};


module.exports = Entity;