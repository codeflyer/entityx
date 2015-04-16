module.exports = function(attribute) {
  return 'this._setData(\'' + attribute.name + '\', ' +
      'this.getLoaderHelper().loadEntity(\'' +
      attribute.class + '\', ' +
      'details.' + attribute.name + ', ' +
      attribute.isNullable + ')' +
      ');\n';
};