function ServiceAbstract(parameters) {
  this._parameters = parameters;
}

ServiceAbstract.prototype.getParameters = function() {
  return this._parameters;
};
module.exports = ServiceAbstract;
