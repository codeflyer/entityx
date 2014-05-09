/**
 * Initialize module core-object
 *
 * @author Davide Fiorello <davide@codeflyer.com>
 */
var Entity = require('./entities/Entity');
var ValueObject = require('./entities/ValueObject');
var MongoDBObjectID = require('./repositories/MongoDBObjectID');
var MongoDBSequence = require('./repositories/MongoDBSequence');
var Factory = require('./Factory');
var constant = require('./constant');
var ConnectionManager = require('./services/ConnectionManager');
module.exports = {
    Entity : Entity,
    ValueObject : ValueObject,
    constant : constant,
    Factory : Factory,
    ConnectionManager : ConnectionManager,
    drivers : {
        MongoDBObjectID : MongoDBObjectID,
        MongoDBSequence : MongoDBSequence
    }
};