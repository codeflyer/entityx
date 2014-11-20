module.exports = function(attribute) {
  return 'this._setData(\'' +
      attribute.name + '\', details.' +
      attribute.name + ' != null ? details.' +
      attribute.name + ' : null);\n';
};
