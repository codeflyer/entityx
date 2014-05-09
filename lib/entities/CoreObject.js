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
 * Add Entity field
 * @param {string} key
 * @param {string} className The name of the Entity in Module/Class format
 * @param {null|{_id : *}} doc
 * @param {boolean} isNullable If true the function permit a null value
 * @protected
 */
CoreObject.prototype._setDataEntity = function(key, className, doc, isNullable) {
    if(doc === Object(doc)) {
        if(doc._id == null) {
            throw "Invalid identifier [Object without _ID]";
        }
        this._setData(key, Factory.getModel(className, doc._id));
    } else if(doc == null) {
        if(!isNullable) {
            throw "Null object non accepted";
        }
        this._setData(key, null);
    } else {
        throw "Invalid identifier";
    }
};

/**
 * Get value
 * @param {String} key
 * @returns {*}
 * @protected
 */
CoreObject.prototype._getData = function(key) {
    if(!(key in this._data)) {
        throw "Key not initialized";
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

module.exports = CoreObject;