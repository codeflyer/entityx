var util = require('util');
var MongoDBSequenceDriver = require('./MongoDBSequence');
var Promise = require('bluebird');
var q = require('q');
var ErrorX = require('ErrorX');

var MongoDBInnerDriver = function(options, id) {
  MongoDBSequenceDriver.call(this, options);

  if (options.innerFieldName == null) {
    throw new Error('Inner field Name not defined');
  } else if (typeof options.innerFieldName !== 'string' ||
      options.innerFieldName.length === 0) {
    throw new Error('Inner field Name not valid');
  } else {
    this.innerFieldName = options.innerFieldName;
  }

  if (id > 0) {
    this._id = id;
  }
};
util.inherits(MongoDBInnerDriver, MongoDBSequenceDriver);

/**
 * Get a new ID for the insert
 * @return {*} promise
 */
MongoDBInnerDriver.prototype.getNewId = Promise.method(function() {

  return q.ninvoke(this.getCollection('sequences'),
      'findAndModify',
      {_id: this.collectionName + ':' + this.innerFieldName},
      [],
      {$inc: {seq: 1}},
      {new: true}
  ).then(
      function(doc) {
        if (doc.length !== 2) {
          throw new ErrorX(412, 'Sequence getNewId return not valid');
        }
        if (doc[1].ok !== 1) {
          throw new ErrorX(412, 'Sequence not initialized');
        }
        return doc[1].value.seq;
      }
  ).catch(
      function(err) {
        throw new ErrorX(500, 'MongoDb error', err);
      }
  );
});

MongoDBInnerDriver.prototype.insert = Promise.method(function(parentId, data) {
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

  var that = this;
  return this.getNewId().then(
      function(newId) {
        data._id = newId;
        var newEntry = {};
        newEntry[that.innerFieldName] = data;
        return that.mongoDbUpdate(
            {'_id': parentId},
            {$push: newEntry}
        );
      }
  ).then(
      function() {
        return null;
      }
  ).catch(
      function(err) {
        throw new ErrorX(500, 'MongoDb error', err);
      }
  );
});

MongoDBInnerDriver.prototype.update = Promise.method(function(data) {
  this._requireInit();

  var query = {};
  query[this.innerFieldName + '._id'] = this._id;
  var update = {};
  for (var key in data) {
    if (data.hasOwnProperty(key)) {
      update[this.innerFieldName + '.$.' + key] = data[key];
    }
  }
  if (this.useTimestamp) {
    if (this.timestampFlat) {
      update[this.innerFieldName + '.$._modified'] = new Date();
    } else {
      update[this.innerFieldName + '.$._ts.modified'] = new Date();
    }
  }

  return this.mongoDbUpdate(
      query,
      {$set: update}
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
 * Load the entity referred to ID
 * @return {*} promise
 */
MongoDBInnerDriver.prototype.loadEntity = Promise.method(function() {
  this._requireInit();

  var query = {};
  query[this.innerFieldName + '._id'] = this._id;

  var projection = {};
  projection[this.innerFieldName + '.$'] = 1;

  return this.mongoDbFindOne(
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

module.exports = MongoDBInnerDriver;
