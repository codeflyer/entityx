var util = require('util');
var MongoDB = require('./MongoDB');
var ObjectID = require('mongodb').ObjectID;

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

MongoDBObjectIDDriver.prototype.insert = function(data, next) {
  var that = this;

  if (that.useTimestamp) {
    var creationDate = new Date();
    if (that.timeStampFlat) {
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

  that.getCollection(that.collectionName).insert(data, function(err, doc) {
    if (err) {
      return next(err);
    }
    return next(null, doc[0]);
  });
};

module.exports = MongoDBObjectIDDriver;
