/**
 * Initialize module entityx
 *
 * @author Davide Fiorello <davide@codeflyer.com>
 */
var ConnectionManager = require('connection-store');

var Entity = require('./entities/Entity');
var ValueObject = require('./entities/ValueObject');
var ServiceAbstract = require('./services/ServiceAbstract');
var MongoDBObjectID = require('./repositories/MongoDBObjectID');
var MongoDBSequence = require('./repositories/MongoDBSequence');
var MongoDBSequenceManager = require('./repositories/MongoDbSequenceManager');
var AggregatePipe = require('./repositories/MongoDbAggregatePipe');
var configure = require('./configure');
var Factory = require('./Factory');
var EntityX = require('./EntityX');
var constant = require('./constant');
var errorCodes = require('./errorCodes');
var Builder = require('./generators/Builder');
var logger = require('./logger');

module.exports = {
  EntityX: EntityX,
  configure: configure,
  addModule: EntityX.addModule,
  getRegisteredModulesName: EntityX.getRegisteredModulesName,
  getEntityX: EntityX.getEntityX,
  isModuleSet: EntityX.isModuleSet,
  Factory: Factory,
  constant: constant,
  errorCodes: errorCodes,
  ConnectionManager: ConnectionManager,
  helpers: {
    MongoDb: {
      AggregatePipe: AggregatePipe
    }
  },
  services: {
    ServiceAbstract: ServiceAbstract
  },
  entities: {
    Entity: Entity,
    ValueObject: ValueObject
  },
  repositories: {
    MongoDBObjectID: MongoDBObjectID,
    MongoDBSequence: MongoDBSequence,
    MongoDBSequenceManager: MongoDBSequenceManager
  },
  Builder: Builder,
  setLogger: logger.setLogger
};
