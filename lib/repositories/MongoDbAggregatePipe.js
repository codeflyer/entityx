function AggregatePipe() {
  this.pipe = [];
}

var pipelineOps = ['project', 'match', 'limit', 'skip',
  'unwind', 'group', 'sort', 'geoNear'];

pipelineOps.forEach(function(op) {
  var key = '$' + op;
  AggregatePipe.prototype[op] = function(opt) {
    var obj = {};
    obj[key] = opt;
    this.pipe.push(obj);
    return this;
  };
});

AggregatePipe.prototype.getPipe = function() {
  return this.pipe;
};

module.exports = AggregatePipe;
