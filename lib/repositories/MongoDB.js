/**
 *
 * Base class repository
 *
 * @author Davide Fiorello <davide@codeflyer.com>
 */
var Promise = require('bluebird');
var ErrorX = require('codeflyer-errorx');
var errorCodes = require('../errorCodes');
var connectionManager = require('connection-store');
var get = require('lodash/get')
/**
 *
 */
var MongoDBDriver = function (params) {
  if (params == null) {
    throw new ErrorX(errorCodes.INVALID_INIT_PARAMS,
        'Driver initialization require params');
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
};

/**
 * Get the connectionObject
 * @returns {*}
 */
MongoDBDriver.prototype.getConnection = function () {
  if (this.connectionName != null) {
    return connectionManager.getConnection(this.connectionName);
  }
  return connectionManager.getConnection();
};

/**
 * Get a collection by name
 * @param {string} collectionName
 * @returns {*}
 */
MongoDBDriver.prototype.getCollection = function (collectionName) {
  if (collectionName == null) {
    collectionName = this.collectionName;
  }
  return this.getConnection().collection(collectionName);
};

// Mongodb promisify methods
MongoDBDriver.prototype.mongoDbFindAndModify =
    function (query, sort, update, options) {
      var that = this;
      return new Promise(function (resolve, reject) {
        that.getCollection().findAndModify(query, sort, update, options,
            function (err, doc) {
              if (err) {
                return reject(new ErrorX(errorCodes.REPOSITORY_OPERATION_ERROR,
                    'Error on findAndModify', err));
              }
              resolve(doc);
            });
      });
    };

MongoDBDriver.prototype.mongoDbInsert = function (data) {
  var that = this;
  return new Promise(function (resolve, reject) {
    that.getCollection().insert(data,
        function (err, result) {
          if (err || !get(result, 'result.ok')) {
            return reject(new ErrorX(errorCodes.REPOSITORY_OPERATION_ERROR,
                'Error on insert', err));
          }
          resolve(result.ops);
        });
  });
};

MongoDBDriver.prototype.mongoDbSave = function (data) {
  var that = this;
  return new Promise(function (resolve, reject) {
    that.getCollection().save(data,
        function (err, result) {
          if (err) {
            return reject(new ErrorX(errorCodes.REPOSITORY_OPERATION_ERROR,
                'Error on save', err));
          }
          resolve(result);
        });
  });
};

MongoDBDriver.prototype.mongoDbUpdate = function (query,
                                                  update,
                                                  options) {
  var that = this;
  return new Promise(function (resolve, reject) {
    that.getCollection().update(query, update, options,
        function (err, result) {
          if (err) {
            return reject(new ErrorX(errorCodes.REPOSITORY_OPERATION_ERROR,
                'Error on update', err));
          }
          resolve(result);
        });
  });
};

MongoDBDriver.prototype.mongoDbFind = function (query,
                                                projection,
                                                options) {
  var that = this;
  return new Promise(function (resolve, reject) {
    that.getCollection().find(query, projection, options,
        function (err, result) {
          if (err) {
            return reject(new ErrorX(errorCodes.REPOSITORY_OPERATION_ERROR,
                'Error on find', err));
          }
          resolve(result);
        });
  });
};

MongoDBDriver.prototype.mongoDbCount = function (query) {
  var that = this;
  return new Promise(function (resolve, reject) {
    that.getCollection().count(query,
        function (err, result) {
          if (err) {
            return reject(new ErrorX(errorCodes.REPOSITORY_OPERATION_ERROR,
                'Error on find', err));
          }
          resolve(result);
        });
  });
};

MongoDBDriver.prototype.mongoDbFindToArray = function (query,
                                                       projection,
                                                       options) {
  var that = this;
  return new Promise(function (resolve, reject) {
    that.getCollection().find(query, projection, options).toArray(
        function (err, result) {
          if (err) {
            return reject(new ErrorX(errorCodes.REPOSITORY_OPERATION_ERROR,
                'Error on find.toArray', err));
          }
          resolve(result);
        });
  });
};

MongoDBDriver.prototype.mongoDbFindOne = function (query,
                                                   projection,
                                                   options) {
  var that = this;
  return new Promise(function (resolve, reject) {
    that.getCollection().findOne(query, projection, options,
        function (err, result) {
          if (err) {
            return reject(new ErrorX(errorCodes.REPOSITORY_OPERATION_ERROR,
                'Error on findOne', err));
          }
          resolve(result);
        });
  });
};

MongoDBDriver.prototype.mongoDbRemove = function (query,
                                                  options) {
  var that = this;
  return new Promise(function (resolve, reject) {
    that.getCollection().remove(query, options,
        function (err, result) {
          if (err) {
            return reject(new ErrorX(errorCodes.REPOSITORY_OPERATION_ERROR,
                'Error on remove', err));
          }
          resolve(result);
        });
  });
};

MongoDBDriver.prototype.mongoDbAggregate = function (pipe) {
  var that = this;
  return new Promise(function (resolve, reject) {
    that.getCollection().aggregate(pipe, function (err, docs) {
      if (err) {
        return reject(new ErrorX(errorCodes.REPOSITORY_OPERATION_ERROR,
            'Error on aggregate', err));
      }
      resolve(docs);
    });
  });
};

module.exports = MongoDBDriver;
