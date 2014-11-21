var util = require('util');
var MongoDB = require('./MongoDB');
var Promise = require('bluebird');
var q = require('q');
var ErrorX = require('ErrorX');

var MongoDBSequenceDriver = function(options, id) {
  MongoDB.call(this, options);

  if (id > 0) {
    this._id = id;
  }
};
util.inherits(MongoDBSequenceDriver, MongoDB);

/**
 * Reset a sequence on MongoDb
 * @param {string} collectionName
 * @param {number} [value=0]
 * @returns {*} promise
 */
MongoDBSequenceDriver.prototype.resetSequence =
    Promise.method(function(collectionName, value) {
      if (collectionName == null) {
        throw new ErrorX(413, 'Collection not defined');
      }
      if (value == null) {
        value = 0;
      }

      return q.ninvoke(this.getCollection('sequences'),
          'save',
          {_id: collectionName, seq: value}
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

/**
 * Get a new ID for the insert
 * @return {*} promise
 */
MongoDBSequenceDriver.prototype.getNewId = Promise.method(function() {
  return q.ninvoke(this.getCollection('sequences'),
      'findAndModify',
      {_id: this.collectionName},
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

MongoDBSequenceDriver.prototype.insert = Promise.method(function(data) {
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
        return q.ninvoke(that.getCollection(), 'insert', data);
      }
  ).then(
      function(doc) {
        return doc[0];
      }
  ).catch(
      function(err) {
        console.log(err);
        throw new ErrorX(500, 'MongoeDb error', err);
      }
  );
});

module.exports = MongoDBSequenceDriver;
