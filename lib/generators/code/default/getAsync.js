var Promise = require('bluebird');
module.exports = function(name) {
  return Promise.method(function() {
    return this._getDataAsync(name);
  });
};
