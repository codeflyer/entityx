var util = require("util");
var Q = require('q');
var Promise = require('bluebird');
var CoreObject = require('./CoreObject');
var ValueObject = require('./ValueObject');
var ErrorMessage = require('./../ErrorMessage');

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


Entity.prototype._getStructuredValueForSave = function() {
    return {'_id': this.getId()};
};

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
 * @protected
 */
Entity.prototype._getData = function(key) {
    if(this._isLoad == false && !this._isNewObject) {
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


Entity.prototype.load = function(details) {
    if(this._isLoad) {
        return Q(this);
    }
    return this._internalLoadDetails(details);
};

/**
 *
 * @param fieldList
 * @returns {*}
 */
Entity.prototype.storeFields = function(fieldList) {
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
            that._isLoad = false;
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
    var that = this;
    Q(details).then(
        function(details) {
            if(details != null) {
                return Q(details);
            }
            if(that._preloadDetails != null) {
                details = that._preloadDetails;
                that._preloadDetails = null;
                return Q(details);
            }
            return that._getDriver().loadEntity();
        }
    ).then(
        function(details) {
            if(details == null) {
                return Q.reject(new ErrorMessage(404, "Entity not exists"));
            }
            return Q.ninvoke(that, "_loadDetails", details);
        }
    ).then(
        function(details) {
            if(that.useTimestamp()) {
                that._setData('ts', details._ts);
            }
            that._isLoad = true;
            deferred.resolve(that);
        }
    ).catch(
        function(err) {
            deferred.reject(err);
        }
    );
    return deferred.promise;
};



/**
 * Insert a new object in the repository
 * @param {Array} fieldList
 * @returns {Promise}
 */
Entity.prototype.insert = Promise.method(function() {
    var that = this;
    try {
        if (this._isNewObject) {
            var promises = {};
            for (var key in this._data) {
                if (this._data.hasOwnProperty(key)) {
                    promises[key] = that._getDataForSave(key);
                }
            }

            return Promise.props(promises).then(
                function(results) {
                    return Q.ninvoke(that._getDriver(), 'insert', results);
                }
            ).then(
                function(result) {
                    that._id = result._id;
                    that._isNewObject = false;
                    return that;
                }
            ).catch(function(err) {
                    throw new ErrorMessage(500, 'Error in insert', err);
                });
        } else {
            throw new ErrorMessage(150, 'Entity already insert', e);
        }
    } catch (e) {
        throw new ErrorMessage(150, 'Error', e);
    }
});


module.exports = Entity;