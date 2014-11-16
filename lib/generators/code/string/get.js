var Promise = require('bluebird');
module.exports = function(name) {
  return function() {
    var that = this;
    return new Promise(function(resolve, reject) {
      if (this._isLoad) {
        return Promise.resolve(this._getData(name));
      }
      that.load().then(
          function() {
            resolve(that._getData(name));
          }
      ).catch(function(err) {
            reject(err);
          });
    });
  };
};
