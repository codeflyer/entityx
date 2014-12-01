var util = require('util');
var CoreObject = require('./CoreObject');
var Factory = require('../Factory');

var ValueObject = function() {
  CoreObject.call(this);
};
util.inherits(ValueObject, CoreObject);

ValueObject.prototype._getStructuredValueForSave = function() {
  return this._data;
};

/**
 * Add Entity field
 * @param {string} key
 * @param {string} className The name of the Entity in Module/Class format
 * @param {null|{_id : *}|Array} docs The documents
 * @param {boolean} isNullable If true the function permit a null value
 * @protected
 */
ValueObject.prototype._setDataEntity =
    function(key, className, docs, isNullable) {
      if (docs == null || docs.length < 1) {
        if (!isNullable) {
          throw new Error('Null object non accepted');
        }
        this._setData(key, null);
      } else if (Array.isArray(docs)) {
        var docsEntity = [];
        for (var i = 0; i < docs.length; i++) {
          if (docs[i] === Object(docs[i])) {
            if (docs[i]._id == null) {
              throw new Error('Invalid identifier ' +
              '[Object in Array without _ID]');
            }
            docsEntity.push(Factory.getEntity(className, docs[i]._id));
          } else if (docs[i] == null) {
            if (!isNullable) {
              throw new Error('Null object non accepted in array');
            }
          } else {
            throw new Error('Invalid identifier');
          }
        }
        this._setData(key, docsEntity);
      } else if (docs === Object(docs)) {
        if (docs._id == null) {
          throw new Error('Invalid identifier [Object without _ID]');
        }
        this._setData(key, Factory.getEntity(className, docs._id));
      } else {
        throw new Error('Invalid identifier');
      }
    };

/**
 * Add value object field
 * @param {string} key
 * @param {string} className The name of the ValueObject in Module/Class format
 * @param {null|Object} doc The document
 * @param {boolean} isNullable If true the function permit a null value
 * @protected
 */
ValueObject.prototype._setDataValueObject =
    function(key, className, doc, isNullable) {
      if (doc == null) {
        if (!isNullable) {
          throw new Error('Null object non accepted');
        }
        this._setData(key, null);
      } else {
        this._setData(key, Factory.getValueObject(className, doc));
      }
    };

module.exports = ValueObject;
