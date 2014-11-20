var Promise = require('bluebird');
module.exports = function(name) {
  return Promise.method(function() {
    if (this._isLoad) {
      return this._getData(name);
    } else {
      return this.load().bind(this).then(
          function() {
            return this._getData(name);
          }
      ).catch(function(err) {
            throw err;
          });
    }
  });
};
