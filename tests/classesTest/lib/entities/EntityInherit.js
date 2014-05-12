var util = require("util");
var Entity = require('./../../../../lib/entities/Entity');

var EntityInherit = function() {
    Entity.call(this, {'useTimestamp' : true});
};
util.inherits(EntityInherit, Entity);

EntityInherit.prototype.setName = function(name) {
    return this._setData('name', name);
};

EntityInherit.prototype.getName = function() {
    return this._getData('name');
};

module.exports = EntityInherit;