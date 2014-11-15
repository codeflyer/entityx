/**
 * Initialize module entityx
 *
 * @author Davide Fiorello <davide@codeflyer.com>
 */
var Entity = require('./entities/Entity');
var ValueObject = require('./entities/ValueObject');
var HelperAbstract = require('./helpers/HelperAbstract');
var MongoDBObjectID = require('./repositories/MongoDBObjectID');
var MongoDBSequence = require('./repositories/MongoDBSequence');
var Factory = require('./Factory');
var EntityX = require('./EntityX');
var constant = require('./constant');
var ConnectionManager = require('./services/ConnectionManager');

module.exports = {
  EntityX: EntityX,
  configure: configure,
  setApplicationRoot: EntityX.setApplicationRoot,
  getApplicationRoot: EntityX.getApplicationRoot,
  addModule: EntityX.addModule,
  getRegisteredModulesName: EntityX.getRegisteredModulesName,
  getEntityX: EntityX.getEntityX,
  isModuleSet: EntityX.isModuleSet,
  Factory: Factory,
  Entity: Entity,
  ValueObject: ValueObject,
  HelperAbstract: HelperAbstract,
  constant: constant,
  ConnectionManager: ConnectionManager,
  drivers: {
    MongoDBObjectID: MongoDBObjectID,
    MongoDBSequence: MongoDBSequence
  }
};
