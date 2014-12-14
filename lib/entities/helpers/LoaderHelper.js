var ErrorX = require('ErrorX');
var Factory = require('../../Factory');

/**
 * Add Entity field
 * @param {string} className The name of the Entity in Module/Class format
 * @param {null|{_id : *}|Array} docs The documents
 * @param {boolean} isNullable If true the function permit a null value
 * @protected
 */
function loadDataEntity(className, docs, isNullable) {
  if (docs == null || docs.length < 1) {
    if (!isNullable) {
      throw new ErrorX(401, 'Null object non accepted');
    }
    return null;
  } else if (Array.isArray(docs)) {
    var docsEntity = [];
    for (var i = 0; i < docs.length; i++) {
      if (docs[i] === Object(docs[i])) {
        if (docs[i]._id == null) {
          throw new ErrorX(400, 'Invalid identifier ' +
          '[Object in Array without _ID]');
        }
        docsEntity.push(Factory.getEntity(className, docs[i]._id));
      } else if (docs[i] == null) {
        if (!isNullable) {
          throw new ErrorX(401, 'Null object non accepted in array');
        }
      } else {
        throw new ErrorX(402, 'Invalid identifier');
      }
    }
    return docsEntity;
  } else if (docs === Object(docs)) {
    if (docs._id == null) {
      throw new ErrorX(403, 'Invalid identifier [Object without _ID]');
    }
    return Factory.getEntity(className, docs._id);
  } else {
    throw new ErrorX(402, 'Invalid identifier');
  }
}

/**
 * Add value object field
 * @param {string} className The name of the ValueObject in Module/Class format
 * @param {null|Object} doc The document
 * @param {boolean} isNullable If true the function permit a null value
 * @protected
 */
function loadDataValueObject(className, doc, isNullable) {
  if (doc == null) {
    if (!isNullable) {
      throw new ErrorX(401, 'Null object non accepted');
    }
    return null;
  } else {
    return Factory.getValueObject(className, doc);
  }
}

module.exports = {
  loadDataEntity: loadDataEntity,
  loadDataValueObject: loadDataValueObject
};
