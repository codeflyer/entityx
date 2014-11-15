var Factory = require('../Factory');

function HelperAbstract(parameters) {
  this._parameters = parameters;
}

HelperAbstract.prototype.getParameters = function() {
  return this._parameters;
};
module.exports = HelperAbstract;
