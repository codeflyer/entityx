var util = require('util');
var ObjectID = require('mongodb').ObjectID;
var Promise = require('bluebird');
var ErrorX = require('ErrorX');
var errorCodes = require('../errorCodes');

var MongoDBAbstractDriver = require('./MongoDBAbstractDriver');

/**
 *
 * @param {Object} options
 * @param {ObjectId|string|integer} id The identifier
 * @constructor
 */
var MongoDBObjectIDDriver = function(options, id) {
  MongoDBAbstractDriver.call(this, options);
  try {
    if (id != null) {
      if (id.constructor.name === 'ObjectID') {
        this._id = id;
      } else {
        this._id = new ObjectID(id);
      }
    }
  } catch (e) {
    throw new ErrorX(errorCodes.INVALID_PARAMS, 'ObjectId init not valid', e);
  }
};
util.inherits(MongoDBObjectIDDriver, MongoDBAbstractDriver);

MongoDBObjectIDDriver.prototype.insert = Promise.method(function(data) {
  this.addTimestampInsertValue(data);
  return this.mongoDbInsert(data).then(
      function(doc) {
        return doc[0];
      }
  ).catch(
      function(err) {
        throw new ErrorX(err.code, 'Error on insert new document', err);
      }
  );
});

module.exports = MongoDBObjectIDDriver;
