/**
 * Initialize module entityx
 *
 * @author Davide Fiorello <davide@codeflyer.com>
 */
var Entity = require('./entities/Entity');
var ValueObject = require('./entities/ValueObject');
var ServiceAbstract = require('./services/ServiceAbstract');
var MongoDBObjectID = require('./repositories/MongoDBObjectID');
var MongoDBSequence = require('./repositories/MongoDBSequence');
var configure = require('./configure');
var Factory = require('./Factory');
var EntityX = require('./EntityX');
var constant = require('./constant');
var ConnectionManager = require('./services/ConnectionManager');
var Builder = require('./generators/Builder');

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
  constant: constant,
  ConnectionManager: ConnectionManager,
  services: {
    ServiceAbstract: ServiceAbstract
  },
  entities: {
    Entity: Entity,
    ValueObject: ValueObject
  },
  repositories: {
    MongoDBObjectID: MongoDBObjectID,
    MongoDBSequence: MongoDBSequence
  },
  Builder: Builder
};
