var util = require('util');
var ErrorX = require('ErrorX');
var Promise = require('bluebird');

var CoreObject = require('./CoreObject');
var Factory = require('../Factory');

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

  if (params.repositoryName != null) {
    this._repositoryName = params.repositoryName;
  } else {
    this._repositoryName = null;
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

  if (id.constructor.name === 'ObjectID') {
    this._id = id.toString();
  } else {
    this._id = id;
  }

  if (details != null) {
    this._preloadDetails = details;
  }
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
    throw new ErrorX(404, 'Entity not loaded: need entity.load().then(...)');
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
  // TODO Manage error
  return this._getRepository().exists();
};

/**
 * Delete the entity
 * @returns {promise}
 */
Entity.prototype.delete = function(permanent) {
  // TODO Manage error
  if (permanent == null) {
    permanent = false;
  }
  return this._getRepository().delete(permanent);
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
Entity.prototype.storeFields = Promise.method(function(fieldList) {
  if (fieldList.length === 0) {
    return;
  }
  var dataToUpdate = {};
  var that = this;
  try {
    fieldList.forEach(function(element, index) {
      dataToUpdate[element] = that._getDataForSave(element);
    });
  } catch (e) {
    throw new ErrorX(150, 'Field not exists', e);
  }

  return this._getRepository().update(dataToUpdate).bind(this).then(
      function(result) {
        this._isLoad = false;
        return result;
      }
  ).catch(
      function(err) {
        throw err;
      }
  );
});

/**
 *
 * @param {Object} details
 * @private
 */
Entity.prototype._internalLoadDetails = Promise.method(function(details) {
  return Promise.resolve(details).bind(this).then(
      function(details) {
        if (details != null) {
          return details;
        }
        if (this._preloadDetails != null) {
          details = this._preloadDetails;
          this._preloadDetails = null;
          return details;
        }
        return this._getRepository().loadEntity();
      }
  ).then(
      function(details) {
        if (details == null) {
          throw new ErrorX(404, 'Entity not exists');
        }
        this._loadDetails(details);
        return details;
      }
  ).then(
      function(details) {
        if (this.useTimestamp()) {
          this._setData('ts', details._ts);
        }
        this._isLoad = true;
        return this;
      }
  ).catch(
      function(err) {
        throw err;
      }
  );
});

/**
 * @interfaceMethod
 * @returns {*}
 * @private
 */
Entity.prototype._getRepository = function() {
  if (this._repositoryName == null) {
    throw new ErrorX(100, 'Repository name not initialized');
  }
  return Factory.getRepository(this._repositoryName, this.getId());
};

Entity.prototype._getStructuredValueForSave = function() {
  return {'_id': this.getId()};
};

module.exports = Entity;
