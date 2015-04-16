module.exports = function(attribute) {
  return 'this._setData(\'' + attribute.name + '\', ' +
      'this.getLoaderHelper().loadValueObject(\'' +
      attribute.class + '\', ' +
      'details.' + attribute.name + ', ' +
      attribute.isNullable + ')' +
      ');\n';
};