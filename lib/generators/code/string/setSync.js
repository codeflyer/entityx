module.exports = function(name) {
  return function(value) {
    return this._setData(name, value);
  }
};
