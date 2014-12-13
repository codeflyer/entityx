module.exports = function(attribute) {
  return 'this._setData(\'' + attribute.name + '\', ' +
      'this.getLoaderHelper().loadDataEntity(\'' +
      attribute.class + '\', ' +
      'details.' + attribute.name + ', ' +
      (attribute.isNullable ? 'true' : 'false') + ')' +
      ');\n';
};
