var util = require('util');
var ObjectID = require('mongodb').ObjectID;
var Promise = require('bluebird');
var q = require('q');
var ErrorX = require('ErrorX');

var MongoDB = require('./MongoDB');

/**
 *
 * @param {Object} options
 * @param {ObjectId|string|integer} id The identifier
 * @constructor
 */
var MongoDBObjectIDDriver = function(options, id) {
  MongoDB.call(this, options);

  if (id != null) {
    if (id.constructor.name === 'ObjectID') {
      this._id = id;
    } else {
      try {
        this._id = new ObjectID(id);
      } catch (e) {
        throw new Error(e);
      }
    }
  }
};
util.inherits(MongoDBObjectIDDriver, MongoDB);

MongoDBObjectIDDriver.prototype.insert = Promise.method(function(data) {
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

  return q.ninvoke(this.getCollection(), 'insert', data).then(
    function(doc) {
      return doc[0];
    }
  ).catch(
    function(err) {
      throw new ErrorX(500, 'MongoDb error', err);
    }
  );
});

module.exports = MongoDBObjectIDDriver;
