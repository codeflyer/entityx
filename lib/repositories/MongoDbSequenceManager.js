var util = require('util');
var MongoDB = require('./MongoDB');
var Promise = require('bluebird');
var ErrorX = require('ErrorX');

var MongoDbSequenceManager = function() {
  MongoDB.call(this, {
    collectionName: 'sequences'
  });
};
util.inherits(MongoDbSequenceManager, MongoDB);

/**
 * Reset a sequence on MongoDb
 * @param {string} collectionName
 * @param {number} [value=0]
 * @returns {*} promise
 */
MongoDbSequenceManager.prototype.resetSequence =
    Promise.method(function(sequenceId, value) {
      if (sequenceId == null) {
        throw new ErrorX(413, 'Collection not defined');
      }
      if (value == null) {
        value = 0;
      }

      return this.mongoDbSave(
          {_id: sequenceId, seq: value}
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
MongoDbSequenceManager.prototype.getNewId =
    Promise.method(function(sequenceId) {
      return this.mongoDbFindAndModify(
          {_id: sequenceId},
          [],
          {$inc: {seq: 1}},
          {new: true}
      ).then(
          function(doc) {
            if (doc.ok !== 1) {
              throw new ErrorX(412, 'Sequence not initialized');
            }
            return doc.value.seq;
          }
      ).catch(
          function(err) {
            throw new ErrorX(500, 'MongoDb error', err);
          }
      );
    });

module.exports = new MongoDbSequenceManager();
