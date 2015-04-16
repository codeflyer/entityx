module.exports = function(attribute) {
  return 'this._setData(\'' + attribute.name + '\', ' +
      'this.getLoaderHelper().loadListOfValueObject(\'' +
      attribute.class + '\', ' +
      'details.' + attribute.name + ', ' +
      attribute.canBeLengthZero + ', ' +
      attribute.isNullable + ')' +
      ');\n';
};