var util = require("util");
var Entity = require('./../../../../lib/entities/Entity');

var EntityInheritSibling = function() {
    Entity.call(this, {'useTimestamp' : true});
};
util.inherits(EntityInheritSibling, Entity);

module.exports = EntityInheritSibling;