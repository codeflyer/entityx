var util = require('util');
var MongoDBSequenceDriver = require('./MongoDBSequence');

var MongoDBInnerDriver = function(options, id) {
  MongoDBSequenceDriver.call(this, options);

  if (options['innerFieldName'] == null) {
    throw new Error('Inner field Name not defined');
  } else if (typeof options['innerFieldName'] !== 'string' ||
      options['innerFieldName'].length == 0) {
    throw new Error('Inner field Name not valid');
  } else {
    this.innerFieldName = options['innerFieldName'];
  }

  if (id > 0) {
    this._id = id;
  }
};
util.inherits(MongoDBInnerDriver, MongoDBSequenceDriver);

/**
 * This callback is displayed as a global member.
 * @callback MongoDBInnerDriver~newIdCallback
 * @param {error} err
 * @param {number} newId
 */

/**
 * Get a new ID for the insert
 * @param {MongoDBInnerDriver~newIdCallback} next
 */
MongoDBInnerDriver.prototype.getNewId = function(next) {
  this.getCollection('sequences').findAndModify(
    {_id: this.collectionName + ':' + this.innerFieldName},
    [],
    {$inc: {seq: 1}},
    {new: true},
    function(err, doc) {
      if (err) {
        return next(err);
      }
      next(null, doc.seq);
    });
};

MongoDBInnerDriver.prototype.insert = function(parentId, data, next) {
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

  this.getNewId(function(err, newId) {
      if (err) {
        return next(err);
      }
      data._id = newId;
      var newEntry = {};
      newEntry[that.innerFieldName] = data;
      that.getCollection(that.collectionName).update(
          {'_id': parentId}, {$push: newEntry},
        function(err, doc) {
          if (err) {
            return next(err);
          }
          return next(null, doc[0]);
        });
    }
  );
}
;

MongoDBInnerDriver.prototype.update = function(data, next) {
  if (!this.isInit()) {
    return next('Driver not initialized');
  }

  var query = {};
  query[this.innerFieldName + '._id'] = this._id;
  var update = {};
  for (var key in data) {
    update[this.innerFieldName + '.$.' + key] = data[key];
  }
  if (this.useTimestamp) {
    if (that.timeStampFlat) {
      update[this.innerFieldName + '.$._modified'] = new Date();
    } else {
      update[this.innerFieldName + '.$._ts.modified'] = new Date();
    }
  }
  this.getCollection().update(query, {$set: update}, function(err, doc) {
    if (err) {
      return next(err);
    }
    next(null, doc);
  });
};

/**
 * This callback is displayed as a global member.
 * @callback MongoDBInnerDriver~loadEntityCallback
 * @param {error} err
 * @param {Object|null} doc
 */

/**
 * Load the entity referred to ID
 * @param {MongoDBInnerDriver~loadEntityCallback} next
 */
MongoDBInnerDriver.prototype.loadEntity = function(next) {
  if (!this.isInit()) {
    return next('Driver not initialized');
  }
  var query = {};
  query[this.innerFieldName + '._id'] = this._id;

  var projection = {};
  projection[this.innerFieldName + '.$'] = 1;

  this.getCollection().findOne(query, projection, function(err, doc) {
    if (err) {
      return next(err);
    }
    next(null, doc);
  });
};

module.exports = MongoDBInnerDriver;
