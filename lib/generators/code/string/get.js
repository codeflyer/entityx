var Q = require('q');
module.exports = function(name) {
  return function() {
    var deferred = Q.defer();
    if (this._isLoad) {
      /* jshint newcap:false */
      return Q(this._getData(name));
    }
    var that = this;
    this.load().then(
      function() {
        deferred.resolve(that._getData(name));
      }
    ).catch(function(err) {
        deferred.reject(err);
      });
    return deferred.promise;
  };
};
