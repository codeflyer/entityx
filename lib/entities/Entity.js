var util = require('util');
var ErrorX = require('ErrorX');
var Promise = require('bluebird');

var CoreObject = require('./CoreObject');
var Factory = require('../Factory');
var errorCodes = require('../errorCodes');

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

/**
 * Check if the entity is a new object (true) or a persisted object(false)
 * @return {boolean}
 */
Entity.prototype.isNewObject = function() {
  return this._isNewObject;
};

/**
 * Check if the Entity is loaded
 * @return {boolean}
 */
Entity.prototype.isLoad = function() {
  return this._isLoad;
};

/**
 * Get the identifier of the entity
 * @return {string|number}
 */
Entity.prototype.getId = function() {
  return this._id;
};

/**
 * Retrieve data fot the class, if the entity is not loaded throw an exception
 * @param {string} key
 * @return {*}
 * @protected
 */
Entity.prototype._getData = function(key) {
  if (this._isLoad === false && !this._isNewObject) {
    throw new ErrorX(404, 'Entity not loaded: need entity.load().then(...)');
  }
  return Entity.super_.prototype._getData.call(this, key);
};

/**
 * Retrieve data async fot the class, if the class is not loaded call the load
 * method of the Entity
 *
 * @param {string} key
 * @return {Promise}
 * @protected
 */
Entity.prototype._getDataAsync = Promise.method(function(key) {
  if (this._isLoad) {
    return Entity.super_.prototype._getData.call(this, key);
  }
  var that = this;
  return this.load().then(
      function() {
        return Entity.super_.prototype._getData.call(that, key);
      }
  );
});

/**
 * Check if an object is the same of this object,
 * Check the type and the identifier
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

/**
 * Exec the loading of the Entity, if the entity is already loaded resolve the
 * promise without load
 * @param {{}} details
 * @return {Promise<Entity>}
 */
Entity.prototype.load = function(details) {
  if (this._isLoad) {
    return Promise.resolve(this);
  }
  return this._internalLoadDetails(details);
};

/**
 * Store the fields of the entity in the repositories
 * @param {Array} fieldList
 * @returns {Promise}
 */
Entity.prototype.storeFields = Promise.method(function(fieldList) {
      if (fieldList.length === 0) {
        return;
      }
      var that = this;
      try {
        var promises = [];
        fieldList.forEach(function(element, index) {
          promises[element] = that._getDataForSave(element);
        });
        return Promise.props(promises).then(
            function(dataToUpdate) {
              return that._getRepository().update(dataToUpdate);
            }
        ).then(
            function(result) {
              that._isLoad = false;
              return result;
            }
        ).catch(
            function(err) {
              throw err;
            }
        );
      }
      catch (e) {
        throw new ErrorX(150, 'Field not exists', e);
      }
    }
);

/**
 * Insert a new object in the repository
 * @param {Array} fieldList
 * @returns {Promise}
 */
Entity.prototype.insert = function() {
  if (!this._isNewObject) {
    return Promise.reject(new ErrorX(
        errorCodes.ENTITY_ALREADY_EXISTS, 'Entity already exists'));
  }

  var that = this;
  return new Promise(function(resolve, reject) {
    that._getAllDataForSave().then(
        function(results) {
          return that._getRepository().insert(results);
        }
    ).then(
        function(result) {
          that._id = result._id;
          that._isNewObject = false;
          resolve(that);
        }
    ).catch(function(err) {
          reject(
              new ErrorX(
                  errorCodes.REPOSITORY_OPERATION_ERROR,
                  'Error in insert', err)
          );
        });
  });
};

/**
 * Prepare all data in the entiry for the save operation
 * @return {*}
 * @private
 */
Entity.prototype._getAllDataForSave = function() {
  var promises = {};
  for (var key in this._data) {
    if (this._data.hasOwnProperty(key)) {
      promises[key] = this._getDataForSave(key);
    }
  }
  return Promise.props(promises);
};

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
 * Inter
 * @param {{}} details
 * @private
 */
Entity.prototype._loadDetails = function(details) {
  throw new ErrorX(errorCodes.INTERFACE_NOT_INHERITED,
      'Abstract method not inherithed (_loadDetails)');
};

/**
 * @interfaceMethod
 * @returns {*}
 * @protected
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

Entity.prototype.getArray = Promise.method(function(fields) {
  var that = this;
  return this.load().then(
      function() {
        if (fields != null && util.isArray(fields)) {
          var retValue = {};
          fields.forEach(function(field) {
            retValue[field] = that._getData(field);
          });
          return retValue;
        } else {
          return that._data;
        }
      }
  ).catch(function(err) {
        throw new ErrorX(345, 'Field not valid', err);
      });
});

module.exports = Entity;
