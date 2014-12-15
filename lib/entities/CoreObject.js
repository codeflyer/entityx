var ErrorX = require('ErrorX');
var loaderHelper = require('./helpers/LoaderHelper');
var errorCodes = require('../errorCodes');

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
 * Get value
 * @param {String} key
 * @returns {*}
 * @protected
 */
CoreObject.prototype._getData = function(key) {
  if (!this._keyExists(key)) {
    throw new ErrorX(404, 'Key [' + key + '] not initialized');
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
  if (data != null && (typeof data._getStructuredValueForSave) === 'function') {
    return data._getStructuredValueForSave();
  }
  return data;
};

CoreObject.prototype._getStructuredValueForSave = function() {
  throw new ErrorX(errorCodes.INTERFACE_NOT_INHERITED,
      'INTERFACE not inherithed (_getStructuredValueForSave)');
};

CoreObject.prototype.getLoaderHelper = function() {
  return loaderHelper;
};

module.exports = CoreObject;
