var util = require('util');
var ErrorMessage = require('ErrorX');
var Promise = require('bluebird');

var CoreObject = require('./CoreObject');
var ValueObject = require('./ValueObject');

var Entity = function(params) {
  CoreObject.call(this);

  if (params == null) {
    throw new Error('Entity initialization require params');
  }

  if (params != null &&
      params.useTimestamp != null &&
      params.useTimestamp === true) {
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
 * @param {number|string} id
 * @param {Object|null} details
 * @private
 */
Entity.prototype._init = function(id, details) {
  if (id == null) {
    throw new Error('Identifier not valid');
  }
  this._isNewObject = false;
  this._id = id;
  if (details != null) {
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
  if (data instanceof Entity) {
    return {'_id': data._id};
  }
  if (data instanceof ValueObject) {
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
 * @param {string} key
 * @return {*}
 * @private
 */
Entity.prototype._getData = function(key) {
  if (this._isLoad === false) {
    throw new Error('Entity not loaded: need entity.load().then(...)');
  }
  return Entity.super_.prototype._getData.call(this, key);
};

/**
 * Check if an object is the same
 * @returns {boolean}
 */
Entity.prototype.equal = function(object) {
  if (object == null) {
    return false;
  }
  return object.constructor === this.constructor &&
      this.getId() === object.getId();
};

/**
 * Verify the existence of the entity
 * @returns {promise}
 */
Entity.prototype.exists = function() {
  return new Promise(function(resolve, reject) {
    this._getRepository().exists(
        function(err, result) {
          if (err) {
            return reject(err);
          }
          resolve(result);
        }
    );
  });
};

/**
 * Delete the entity
 * @returns {promise}
 */
Entity.prototype.delete = function(permanent) {
  if (permanent == null) {
    permanent = false;
  }
  return new Promise(function(resolve, reject) {
    this._getRepository().delete(permanent,
        function(err, result) {
          if (err) {
            return reject(err);
          }
          resolve(result);
        }
    );
  });
};

Entity.prototype.load = function(details) {
  if (this._isLoad) {
    return Promise.resolve(this);
  }
  return this._internalLoadDetails(details);
};

/**
 *
 * @param {Array} fieldList
 * @returns {*}
 */
Entity.prototype.storeFields = function(fieldList) {
  var that = this;
  return new Promise(function(resolve, reject) {
    var dataToUpdate = {};
    fieldList.forEach(function(element, index) {
      dataToUpdate[element] = that._getDataForSave(element);
    });

    that._getRepository().update(
        dataToUpdate,
        function(err, result) {
          if (err) {
            return reject(err);
          }
          that._isLoad = false;
          return resolve(result);
        }
    );
  });
};

/**
 *
 * @param {Object} details
 * @private
 */
Entity.prototype._internalLoadDetails = function(details) {
  var that = this;
  return new Promise(function(resolve, reject) {
    Promise.resolve(details).then(
        function(details) {
          if (details != null) {
            return Promise.resolve(details);
          }
          if (that._preloadDetails != null) {
            details = that._preloadDetails;
            that._preloadDetails = null;
            return Promise.resolve(details);
          }
          return that._getRepository().loadEntity();
        }
    ).then(
        function(details) {
          if (details == null) {
            return Promise.reject(new ErrorMessage(404, 'Entity not exists'));
          }
          that._loadDetails(details);
          return Promise.resolve(details);
        }
    ).then(
        function(details) {
          if (that.useTimestamp()) {
            that._setData('ts', details._ts);
          }
          that._isLoad = true;
          resolve(that);
        }
    ).catch(
        function(err) {
          reject(err);
        }
    );
  });
};

module.exports = Entity;
