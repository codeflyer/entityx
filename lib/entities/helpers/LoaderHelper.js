var ErrorX = require('codeflyer-errorx');
var Factory = require('../../Factory');
var errorCodes = require('../../errorCodes');

/**
 * Check and prepare a list of object
 * @param {string} className The name of the Entity in Module/Class format
 * @param {null|Array} docs The list
 * @param {boolean} canBeLengthZero (default true)
 *                  Check if the list length could be ZERO
 * @param {boolean} isNullable (default true)
 *                  If true the function permit a null value
 * @param {function} loadFunc The function that prepare the object
 * @protected
 */
function _loadListOf(className, docs, canBeLengthZero, isNullable, loadFunc) {
  if (canBeLengthZero === null || canBeLengthZero === undefined) {
    canBeLengthZero = true;
  }
  if (docs != null && !Array.isArray(docs)) {
    throw new ErrorX(errorCodes.TYPE_NOT_ALLOWED,
        'Only array and null allowed');
  }
  docs = docs || [];
  if (!canBeLengthZero && docs.length === 0) {
    throw new ErrorX(errorCodes.EMPTY_ARRAY_NOT_ALLOWED, 'Empty array');
  }

  var docsEntity = [];
  for (var i = 0; i < docs.length; i++) {
    docsEntity.push(loadFunc(className, docs[i], isNullable));
  }
  return docsEntity;
}

/**
 * Add Entity field
 * @param {string} className The name of the Entity in Module/Class format
 * @param {null|{_id : *}|Array} docs The documents
 * @param {boolean} isNullable If true the function permit a null value
 * @protected
 */
function loadEntity(className, docs, isNullable) {
  if (isNullable === null || isNullable === undefined) {
    isNullable = true;
  }
  if (docs == null) {
    if (!isNullable) {
      throw new ErrorX(errorCodes.NULL_OBJECT_NOT_ALLOWED,
          'Null object non accepted');
    }
    return null;
  }

  if (typeof docs === 'object') {
    if (docs._id == null) {
      throw new ErrorX(errorCodes.INVALID_IDENTIFIER,
          'Invalid identifier [Object without _ID]');
    }
    return Factory.getEntity(className, docs._id);
  }
  throw new ErrorX(errorCodes.TYPE_NOT_ALLOWED, 'Object required');
}

/**
 * Check and prepare a list of Entities
 * @param {string} className The name of the Entity in Module/Class format
 * @param {null|Array} docs The list
 * @param {boolean} canBeLengthZero (default true)
 *                  Check if the list length could be ZERO
 * @param {boolean} isNullable (default true)
 *                  If true the function permit a null value
 * @protected
 */
function loadListOfEntities(className, docs, canBeLengthZero, isNullable) {
  return _loadListOf(
      className, docs, canBeLengthZero, isNullable, loadEntity);
}

/**
 * Check and prepare a list of ValueObject
 * @param {string} className The name of the Entity in Module/Class format
 * @param {null|Array} docs The list
 * @param {boolean} canBeLengthZero (default true)
 *                  Check if the list length could be ZERO
 * @param {boolean} isNullable (default true)
 *                  If true the function permit a null value
 * @protected
 */
function loadListOfValueObject(className, docs, canBeLengthZero, isNullable) {
  return _loadListOf(
      className, docs, canBeLengthZero, isNullable, loadValueObject);
}

/**
 * Add value object field
 * @param {string} className The name of the ValueObject in Module/Class format
 * @param {null|Object} doc The document
 * @param {boolean} isNullable If true the function permit a null value
 * @protected
 */
function loadValueObject(className, doc, isNullable) {
  if (isNullable === null || isNullable === undefined) {
    isNullable = true;
  }
  if (doc == null) {
    if (!isNullable) {
      throw new ErrorX(errorCodes.NULL_OBJECT_NOT_ALLOWED,
          'Null object non accepted');
    }
    return null;
  }

  if (typeof doc === 'object') {
    return Factory.getValueObject(className, doc);
  }
  throw new ErrorX(errorCodes.TYPE_NOT_ALLOWED, 'Object required');
}

module.exports = {
  loadEntity: loadEntity,
  loadValueObject: loadValueObject,
  loadListOfEntities: loadListOfEntities,
  loadListOfValueObject: loadListOfValueObject
};
