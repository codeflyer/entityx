/**
 * ClemPlanet
 *
 * Base class driver
 *
 * @author Davide Fiorello <davide@codeflyer.com>
 */
var connectionManager = require('../services/ConnectionManager');
var Promise = require('bluebird');
var q = require('q');
var ErrorX = require('ErrorX');
var errorCodes = require('../errorCodes');

/**
 *
 */
var MongoDBDriver = function(params) {
  if (params == null) {
    throw new ErrorX(errorCodes.INVALID_INIT_PARAMS,
        'Driver initialization require params');
  }

  if (params != null &&
      params.useTimestamp != null &&
      params.useTimestamp === true) {
    this.useTimestamp = true;
  } else {
    this.useTimestamp = false;
  }

  if (params != null &&
      params.timestampFlat != null &&
      params.timestampFlat === true) {
    this.timestampFlat = true;
  } else {
    this.timestampFlat = false;
  }

  if (params.collectionName == null) {
    throw new ErrorX(errorCodes.INVALID_INIT_PARAMS,
        'Collection Name not defined');
  } else if (
      typeof params.collectionName !== 'string' ||
      params.collectionName.length === 0) {
    throw new ErrorX(errorCodes.INVALID_INIT_PARAMS,
        'Collection Name not valid');
  } else {
    this.collectionName = params.collectionName;
  }

  this.connectionName = null;
  if (params.connectionName != null) {
    if (
        typeof params.connectionName !== 'string' ||
        params.connectionName.length === 0) {
      throw new ErrorX(errorCodes.INVALID_INIT_PARAMS,
          'Connection Name not valid');
    } else {
      this.connectionName = params.connectionName;
    }
  }
  this._id = null;
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
  if (this.connectionName != null) {
    return connectionManager.getConnection(this.connectionName);
  }
  return connectionManager.getConnection();
};

/**
 * Check if the driver is initialized, thrown an exception if not init
 * @private
 */
MongoDBDriver.prototype._requireInit = function() {
  if (!this.isInit()) {
    throw new ErrorX(412, 'Driver not initialized');
  }
};

/**
 * Get a collection by name
 * @param {string} collectionName
 * @returns {*}
 */
MongoDBDriver.prototype.getCollection = function(collectionName) {
  if (collectionName == null) {
    collectionName = this.collectionName;
  }
  return this.getConnection().collection(collectionName);
};

/**
 * Load the entity referred to ID
 * @return {promise}
 */
MongoDBDriver.prototype.loadEntity = Promise.method(function() {
  this._requireInit();

  return q.ninvoke(this.getCollection(),
      'findOne',
      {'_id': this._id}
  ).then(
      function(doc) {
        return doc;
      }
  ).catch(
      function(err) {
        throw new ErrorX(500, 'MongoDb error', err);
      }
  );
});

/**
 * Add deleted filter to the query
 * @param {Object} query
 */
MongoDBDriver.prototype.addTimestampFilter = function(query) {
  if (this.useTimestamp) {
    if (this.timestampFlat) {
      query._deleted = null;
    } else {
      query['_ts.deleted'] = null;
    }
  }
};

/**
 * Set the modified field before the save operations
 * @param {Object} data
 */
MongoDBDriver.prototype.addTimestampUpdateValue = function(data) {
  if (this.useTimestamp) {
    if (this.timestampFlat) {
      data._modified = new Date();
    } else {
      data['_ts.modified'] = new Date();
    }
  }
};

/**
 * Retrieve the first object that relay to query
 * @param {Object} query
 * @param {Object} projection
 */
MongoDBDriver.prototype.loadOneBy =
    Promise.method(function(query, projection, sort) {
      query = query || {};
      projection = projection || {};
      this.addTimestampFilter(query);

      return q.ninvoke(this.getCollection(),
          'findOne',
          query,
          projection
      ).then(
          function(doc) {
            return doc;
          }
      ).catch(
          function(err) {
            throw new ErrorX(500, 'MongoDb error', err);
          }
      );
    });

/**
 * Retrieve the objects that relay to query
 * @param {Object} query
 * @param {Object} projection
 */
MongoDBDriver.prototype.loadBy = Promise.method(function(query, projection) {
  query = query || {};
  projection = projection || {};
  this.addTimestampFilter(query);

  return q.ninvoke(this.getCollection().find(query, projection), 'toArray'
  ).then(
      function(docs) {
        if (docs == null) {
          return [];
        }
        return docs;
      }
  ).catch(
      function(err) {
        throw new ErrorX(500, 'MongoDb error', err);
      }
  );
});

/**
 * Check if entity exists
 *
 * @return {*} promise
 */
MongoDBDriver.prototype.exists = Promise.method(function() {
  this._requireInit();

  var query = {'_id': this._id};
  this.addTimestampFilter(query);

  return q.ninvoke(this.getCollection(), 'findOne', query, {'_id': 1}
  ).then(
      function(doc) {
        if (doc == null) {
          return false;
        }
        return true;
      }
  ).catch(
      function(err) {
        throw new ErrorX(500, 'MongoDb error', err);
      }
  );
});

/**
 * Remove an element from the database or set the field _ts.deleted
 * @param {boolean} permanent
 */
MongoDBDriver.prototype.delete = Promise.method(function(permanent) {
  this._requireInit();

  if (permanent == null) {
    permanent = false;
  }
  if (this.useTimestamp && !permanent) {
    var deleted;
    if (this.timestampFlat) {
      deleted = {'_deleted': new Date()};
    } else {
      deleted = {'_ts.deleted': new Date()};
    }
    return q.ninvoke(this.getCollection(),
        'update',
        {'_id': this._id},
        {$set: deleted},
        {'w': 1}
    ).then(
        function() {
          return true;
        }
    ).catch(
        function(err) {
          throw new ErrorX(500, 'MongoDb error', err);
        }
    );
  } else {
    return q.ninvoke(this.getCollection(),
        'remove',
        {'_id': this._id},
        {'w': 1}
    ).then(
        function() {
          return true;
        }
    ).catch(
        function(err) {
          throw new ErrorX(500, 'MongoDb error', err);
        }
    );
  }
});

MongoDBDriver.prototype.update = Promise.method(function(data) {
  this._requireInit();

  this.addTimestampUpdateValue(data);
  return q.ninvoke(this.getCollection(),
      'update',
      {'_id': this._id},
      {$set: data}
  ).then(
      function(doc) {
        return doc;
      }
  ).catch(
      function(err) {
        throw new ErrorX(500, 'MongoDb error', err);
      }
  );
});

MongoDBDriver
    .prototype
    .addValueToCollection = Promise.method(function(key, value, currentField) {
  this._requireInit();

  var updateList = {};
  updateList[key] = value;
  var updateAction = {'$push': updateList};

  var dataToSet = {};
  this.addTimestampUpdateValue(dataToSet);
  if (currentField != null) {
    dataToSet[currentField] = value;
  }

  updateAction.$set = dataToSet;
  return q.ninvoke(this.getCollection(),
      'update',
      {'_id': this.getId()},
      updateAction
  ).then(
      function() {
        return true;
      }
  ).catch(
      function(err) {
        throw new ErrorX(500, 'MongoDb error', err);
      }
  );
});

module.exports = MongoDBDriver;
