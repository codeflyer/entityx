module.exports = function(attribute) {
  return 'this._setDataEntity(\'' +
      attribute.name + '\', \'' +
      attribute.class + '\', details.' +
      attribute.name + ', ' +
      (attribute.isNullable ? 'true' : 'false') + ');\n';
};
