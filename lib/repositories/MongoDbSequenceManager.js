var util = require('util');
var MongoDB = require('./MongoDB');
var Promise = require('bluebird');
var ErrorX = require('codeflyer-errorx');
var errorCodes = require('../errorCodes');

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
        throw new ErrorX(errorCodes.INVALID_PARAMS, 'Collection not defined');
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
            throw new ErrorX(err.code, 'Error on reset sequence', err);
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
              throw new ErrorX(errorCodes.SEQUENCE_NOT_INIT,
                  'Sequence not initialized [' + sequenceId + ']');
            }
            return doc.value.seq;
          }
      ).catch(
          function(err) {
            throw new ErrorX(
                err.code, 'Error on get sequence [' + sequenceId + ']', err);
          }
      );
    });

module.exports = new MongoDbSequenceManager();
