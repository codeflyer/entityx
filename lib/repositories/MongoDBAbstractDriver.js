/**
 * Abstract class repository for mongoDb
 *
 * @author Davide Fiorello <davide@codeflyer.com>
 */
var util = require('util');
var Promise = require('bluebird');
var ErrorX = require('codeflyer-errorx');
var MongoDB = require('./MongoDB');
var errorCodes = require('./../errorCodes');

var MongoDBAbstractDriver = function(params) {
  MongoDB.call(this, params);

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

  this._id = null;
};
util.inherits(MongoDBAbstractDriver, MongoDB);

/**
 * Get the ID of repository
 * @returns {*}
 */
MongoDBAbstractDriver.prototype.getId = function() {
  return this._id;
};

/**
 * Set the repository identifier
 * @returns {*}
 */
MongoDBAbstractDriver.prototype.setId = function(id) {
  this._id = id;
};

/**
 * Check if the repository is initialized (with an id)
 * @returns {boolean}
 */
MongoDBAbstractDriver.prototype.isInit = function() {
  return this._id !== null;
};

/**
 * Check if the repository is initialized, thrown an exception if not init
 * @private
 */
MongoDBAbstractDriver.prototype._requireInit = function() {
  if (!this.isInit()) {
    throw new ErrorX(errorCodes.REPOSITORY_NOT_INIT, 'Driver not initialized');
  }
};

/**
 * Load the entity referred to ID
 * @return {promise}
 */
MongoDBAbstractDriver.prototype.loadEntity = Promise.method(function() {
  this._requireInit();

  return this.mongoDbFindOne(
      {'_id': this._id}
  ).then(
      function(doc) {
        return doc;
      }
  ).catch(
      function(err) {
        throw new ErrorX(err.code, 'Error on load entity operation', err);
      }
  );
});

/**
 * Retrieve the first object that relay to query
 * @param {Object} query
 * @param {Object} projection
 * @param {Object} [options]
 */
MongoDBAbstractDriver.prototype.loadOneBy =
    Promise.method(function(query, projection, options) {
      query = query || {};
      projection = projection || {};
      options = options || {};
      this.addTimestampFilter(query);

      return this.mongoDbFindOne(
          query,
          projection,
          options
      ).then(
          function(doc) {
            return doc;
          }
      ).catch(
          function(err) {
            throw new ErrorX(err.code, 'Error on loadOneBy', err);
          }
      );
    });

/**
 * Retrieve the objects that relay to query
 * @param {Object} query
 * @param {Object} projection
 * @param {Object} [options]
 */
MongoDBAbstractDriver.prototype.loadBy =
    Promise.method(function(query, projection, options) {
      query = query || {};
      projection = projection || {};
      options = options || {};
      this.addTimestampFilter(query);

      return this.mongoDbFindToArray(
          query,
          projection,
          options
      ).then(
          function(docs) {
            return docs;
          }
      ).catch(
          function(err) {
            throw new ErrorX(err.code, 'Error on loadBy', err);
          }
      );
    });

/**
 * Check if entity exists
 *
 * @return {*} promise
 */
MongoDBAbstractDriver.prototype.exists = Promise.method(function() {
  this._requireInit();

  var query = {'_id': this._id};
  this.addTimestampFilter(query);

  return this.mongoDbFindOne(query, {'_id': 1}).then(
      function(doc) {
        if (doc == null) {
          return false;
        }
        return true;
      }
  ).catch(
      function(err) {
        throw new ErrorX(err.code, 'Error on exists', err);
      }
  );
});

/**
 * Remove an element from the database or set the field _ts.deleted
 * @param {boolean} permanent
 */
MongoDBAbstractDriver.prototype._deletePermanent = function() {
  return this.mongoDbRemove(
      {'_id': this._id},
      {'w': 1}
  );
};

/**
 * Remove an element from the database or set the field _ts.deleted
 * @param {boolean} permanent
 */
MongoDBAbstractDriver.prototype._deleteNotPermanent = function() {
  var deleted;
  if (this.timestampFlat) {
    deleted = {'_deleted': new Date()};
  } else {
    deleted = {'_ts.deleted': new Date()};
  }
  return this.mongoDbUpdate(
      {'_id': this._id},
      {$set: deleted},
      {'w': 1}
  );
};

MongoDBAbstractDriver.prototype.delete = Promise.method(function(permanent) {
  this._requireInit();

  if (!this.useTimestamp) {
    permanent = true;
  } else if (permanent == null) {
    permanent = false;
  }

  var that = this;
  return Promise.resolve().then(
      function() {
        if (permanent) {
          return that._deletePermanent();
        } else {
          return that._deleteNotPermanent();
        }
      }
  ).then(
      function() {
        return true;
      }
  ).catch(
      function(err) {
        throw new ErrorX(err.code, 'Error on delete operation', err);
      }
  );

});

MongoDBAbstractDriver.prototype.update = Promise.method(function(data) {
  this._requireInit();

  this.addTimestampUpdateValue(data);
  return this.mongoDbUpdate(
      {'_id': this._id},
      {$set: data}
  ).then(
      function(doc) {
        return doc;
      }
  ).catch(
      function(err) {
        throw new ErrorX(err.code, 'Update operation', err);
      }
  );
});

MongoDBAbstractDriver
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
  return this.mongoDbUpdate(
      {'_id': this.getId()},
      updateAction
  ).then(
      function() {
        return true;
      }
  ).catch(
      function(err) {
        throw new ErrorX(err.code, 'Add value to collection operation', err);
      }
  );
});

MongoDBAbstractDriver.prototype.addToSet =
    Promise.method(function(key, value) {
      this._requireInit();

      var updateList = {};
      updateList[key] = value;
      var updateAction = {'$addToSet': updateList};
      var dataToSet = {};
      this.addTimestampUpdateValue(dataToSet);
      updateAction.$set = dataToSet;
      return this.mongoDbUpdate(
          {'_id': this.getId()},
          updateAction
      ).then(
          function() {
            return true;
          }
      ).catch(
          function(err) {
            throw new ErrorX(err.code,
                'Add value to collection operation', err);
          }
      );
    });

/**
 * Add deleted filter to the query
 * @param {Object} query
 */
MongoDBAbstractDriver.prototype.addTimestampFilter = function(query) {
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
MongoDBAbstractDriver.prototype.addTimestampUpdateValue = function(data) {
  if (this.useTimestamp) {
    if (this.timestampFlat) {
      data._modified = new Date();
    } else {
      data['_ts.modified'] = new Date();
    }
  }
};

/**
 * Set the insert value for timestamp in save operations
 * @param {Object} data
 */
MongoDBAbstractDriver.prototype.addTimestampInsertValue = function(data) {
  if (this.useTimestamp) {
    var creationDate = new Date();
    if (this.timestampFlat) {
      data._created = creationDate;
      data._modified = creationDate;
      data._deleted = null;
    } else {
      data._ts = {
        created: creationDate,
        modified: creationDate,
        deleted: null
      };
    }
  }
};

module.exports = MongoDBAbstractDriver;
