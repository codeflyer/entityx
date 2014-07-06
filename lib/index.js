/**
 * Initialize module entityx
 *
 * @author Davide Fiorello <davide@codeflyer.com>
 */
var Entity = require('./entities/Entity');
var ValueObject = require('./entities/ValueObject');
var MongoDBObjectID = require('./repositories/MongoDBObjectID');
var MongoDBSequence = require('./repositories/MongoDBSequence');
var Factory = require('./Factory');
var ErrorMessage = require('./ErrorMessage');
var constant = require('./constant');
var ConnectionManager = require('./services/ConnectionManager');
module.exports = {
    ErrorMessage : ErrorMessage,
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