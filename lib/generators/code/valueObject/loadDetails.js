module.exports = function(attribute) {
  return 'this._setDataValueObject(\'' +
      attribute.name + '\', \'' +
      attribute.class + '\', details.' +
      attribute.name + ', ' +
      (attribute.isNullable ? 'true' : 'false') + ');\n';
};
