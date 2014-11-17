var ErrorX = require('ErrorX');
var Factory = require('../Factory');

var CoreObject = function() {
  this._data = {};
};

/**
 * Add generic field
 * @param {string} key
 * @param {*} value
 * @protected
 */
CoreObject.prototype._setData = function(key, value) {
  this._data[key] = value;
};

/**
 * Get the list of the keys stored in the object
 * @protected
 */
CoreObject.prototype._getDataKeyList = function() {
  return Object.keys(this._data);
};

/**
 * Add Entity field
 * @param {string} key
 * @param {string} className The name of the Entity in Module/Class format
 * @param {null|{_id : *}|Array} docs The documents
 * @param {boolean} isNullable If true the function permit a null value
 * @protected
 */
CoreObject.prototype._setDataEntity =
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
 * Get value
 * @param {String} key
 * @returns {*}
 * @protected
 */
CoreObject.prototype._getData = function(key) {
  if (!this._keyExists(key)) {
    throw new Error('Key [' + key + '] not initialized');
  }
  return this._data[key];
};

/**
 * Check if key exists in object
 * @param {string} key
 * @returns {boolean}
 * @protected
 */
CoreObject.prototype._keyExists = function(key) {
  return key in this._data;
};

/**
 * Unset a key in object
 * @param {string} key
 * @private
 */
CoreObject.prototype._unset = function(key) {
  delete this._data[key];
};

/**
 * Get value
 * @param {String} key
 * @returns {*}
 * @protected
 */
CoreObject.prototype._getDataForSave = function(key) {
  var data = this._getData(key);

  if (data instanceof CoreObject) {
    return data._getStructuredValueForSave();
  }
  return data;
};

CoreObject.prototype._getStructuredValueForSave = function() {
  throw new ErrorX(500, 'INTERFACE not inherithed');
};

module.exports = CoreObject;
