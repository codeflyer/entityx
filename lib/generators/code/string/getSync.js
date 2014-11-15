module.exports = function(name) {
  return function() {
    return this._getData(name);
  }
};
