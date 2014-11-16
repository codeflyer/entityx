/**
 * ClemPlanet
 *
 * Base class driver
 *
 * @author Davide Fiorello <davide@codeflyer.com>
 */
var connectionManager = require('../services/ConnectionManager');
var Promise = require('bluebird');
var ErrorX = require('ErrorX');
Promise.promisifyAll(require('mongodb'));

/**
 *
 */
var MongoDBDriver = function(params) {
  if (params == null) {
    throw new Error('Driver initialization require params');
  }

  if (params != null &&
      params.useTimestamp != null &&
      params.useTimestamp === true) {
    this.useTimestamp = true;
  } else {
    this.useTimestamp = false;
  }

  if (params != null &&
      params.timeStampFlat != null &&
      params.timeStampFlat === true) {
    this.timeStampFlat = true;
  } else {
    this.timeStampFlat = false;
  }

  if (params.collectionName == null) {
    throw new Error('Collection Name not defined');
  } else if (
      typeof params.collectionName !== 'string' ||
      params.collectionName.length === 0) {
    throw new Error('Collection Name not valid');
  } else {
    this.collectionName = params.collectionName;
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
  return connectionManager.getConnection();
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
  if (!this.isInit()) {
    throw new ErrorX(412, 'Driver not initialized');
  }

  return this.getCollection(this.collectionName).findOneAsync(
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
 * Retrieve the first object that relay to query
 * @param {Object} query
 * @param {Object} projection
 */
MongoDBDriver.prototype.loadOneBy = Promise.method(function() {
  var query;
  var projection;
  query = arguments[0];
  if (arguments.length === 2) {
    projection = arguments[1];
  } else {
    projection = {};
  }
  if (this.useTimestamp) {
    if (this.timeStampFlat) {
      query._deleted = null;
    } else {
      query['_ts.deleted'] = null;
    }
  }

  return this.getCollection(this.collectionName).findOneAsync(query, projection)
      .then(
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
MongoDBDriver.prototype.loadBy = Promise.method(function() {
  var query;
  var projection;
  query = arguments[0];
  if (arguments.length === 2) {
    projection = arguments[1];
  } else {
    projection = {};
  }
  if (this.useTimestamp) {
    if (this.timeStampFlat) {
      query._deleted = null;
    } else {
      query['_ts.deleted'] = null;
    }
  }

  return this.getCollection(this.collectionName).find(
      query,
      projection
  ).toArrayAsync().then(
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
  if (!this.isInit()) {
    throw new ErrorX(412, 'Driver not initialized');
  }
  var query;
  if (this.useTimestamp) {
    if (this.timeStampFlat) {
      query = {'_id': this._id, '_deleted': null};
    } else {
      query = {'_id': this._id, '_ts.deleted': null};
    }

  } else {
    query = {'_id': this._id};
  }
  return this.getCollection(this.collectionName).findOneAsync(
      query,
      {'_id': 1}
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
  if (!this.isInit()) {
    throw new ErrorX(412, 'Driver not initialized');
  }
  if (permanent == null) {
    permanent = false;
  }
  if (this.useTimestamp && !permanent) {
    var deleted;
    if (this.timeStampFlat) {
      deleted = {'_deleted': new Date()};
    } else {
      deleted = {'_ts.deleted': new Date()};
    }
    return this.getCollection(this.collectionName).updateAsync(
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
    return this.getCollection(this.collectionName).removeAsync(
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
  if (!this.isInit()) {
    throw new ErrorX(412, 'Driver not initialized');
  }

  if (this.useTimestamp) {
    if (this.timeStampFlat) {
      data._modified = new Date();
    } else {
      data['_ts.modified'] = new Date();
    }
  }
  return this.getCollection(this.collectionName).updateAsync(
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

MongoDBDriver.prototype.addValueToCollectionAndCurrent =
    Promise.method(function(key, value, currentField) {

      if (this.getId() == null) {
        throw new ErrorX(412, 'Driver not initialized, id not set');
      }

      var collection = this.getCollection();
      var updateList = {};
      var updateCurrent = {};

      updateList[key] = value;
      updateCurrent[currentField] = value;
      return collection.updateAsync(
          {'_id': this.getId()},
          {'$push': updateList, '$set': updateCurrent}
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

MongoDBDriver.prototype.addValueToCollection =
    Promise.method(function(key, value) {
      if (this.getId() == null) {
        throw new ErrorX(412, 'Driver not initialized, id not set');
      }
      var collection = this.getCollection();
      var updateList = {};
      updateList[key] = value;

      return collection.updateAsync(
          {'_id': this.getId()},
          {'$addToSet': updateList}
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
