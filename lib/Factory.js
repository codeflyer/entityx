var EntityX = require('./EntityX');

var Factory = function() {

  var _entityClasses = {};

  var _valueObjectClasses = {};

  var _driverClasses = {};

  var _helperClasses = {};

  return {

    reset: function() {
      _entityClasses = {};
      _valueObjectClasses = {};
      _driverClasses = {};
      _helperClasses = {};
    },

    /**
     *
     * Get the instance of entity
     * @param {string} name
     *      The name of the value object in the format ModuleName/ClassName
     * @param {string|number} id
     *      The identifier of the entity
     * @param {Object} details
     *      The details for the initializations
     * @return {Entity}
     */
    getEntity: function(name, id, details) {
      var ClassObject;
      if (name in _entityClasses) {
        ClassObject = _entityClasses[name];
      } else {
        var split = name.split('/');
        var moduleName = split[0];
        var className = split[1];
        if (!EntityX.isModuleSet(moduleName)) {
          throw new Error('Module [' + moduleName + '] not initialized');
        }
        var currentModule = EntityX.getModule(moduleName);
        ClassObject = require(
            currentModule.getSourceClassLoadPath('entities', className));
        _entityClasses[name] = ClassObject;
      }
      var retObj = new ClassObject();
      if (id != null) {
        if (id.constructor.name === 'ObjectID') {
          retObj._init(id.toString(), details);
        } else {
          retObj._init(id, details);
        }
      }
      return retObj;
    },

    /**
     * Set the entity class object for a given name
     * @param {string} name
     *      The name of the value object in the format ModuleName/ClassName
     * @param {Object} ClassObject
     */
    setModel: function(name, ClassObject) {
      _entityClasses[name] = ClassObject;
    },

    /**
     *
     * Get the instance of a driver
     * @param {string} name
     *      The name of the value object in the format ModuleName/ClassName
     * @param {string|number} id
     *      The identifier of the entity
     * @param {Object} details
     *      The details for the initializations
     * @return {Entity}
     */
    getDriver: function(name, id) {
      var ClassObject;
      if (name in _driverClasses) {
        ClassObject = _driverClasses[name];
      } else {
        var split = name.split('/');
        var moduleName = split[0];
        var className = split[1];
        if (!EntityX.isModuleSet(moduleName)) {
          throw new Error('Module [' + moduleName + '] not initialized');
        }
        var currentModule = EntityX.getModule(moduleName);
        ClassObject = require(
            currentModule.getSourceClassLoadPath('repositories', className));
        _driverClasses[moduleName] = ClassObject;
      }
      if (id == null) {
        return new ClassObject();
      } else {
        return new ClassObject(id);
      }

    },

    /**
     * Set the driver class object for a given name
     * @param {string} name
     * @param {Object} ClassObject
     */
    setDriver: function(name, ClassObject) {
      _driverClasses[name] = ClassObject;
    },

    getHelper: function(name, params) {
      var ClassObject;
      if (name in _helperClasses) {
        ClassObject = _helperClasses[name];
      } else {
        var split = name.split('/');
        var moduleName = split[0];
        var className = split[1];
        if (!EntityX.isModuleSet(moduleName)) {
          throw new Error('Module [' + moduleName + '] not initialized');
        }
        var currentModule = EntityX.getModule(moduleName);
        ClassObject = require(
            currentModule.getSourceClassLoadPath('helpers', className));
        _helperClasses[moduleName] = ClassObject;
      }
      return new ClassObject(params);
    },

    /**
     * Set the helper class object for a given name
     * @param {string} name
     * @param {Object} ClassObject
     */
    setHelper: function(name, ClassObject) {
      _helperClasses[name] = ClassObject;
    },

    /**
     * Get the instance of the value object
     * @param {string} name
     *          The name of the value object in the format ModuleName/ClassName
     * @param {Object} params the values for the object inizialiation
     * @return {ClassObject}
     */
    getValueObject: function(name, params) {
      var ClassObject;
      if (name in _valueObjectClasses) {
        ClassObject = _valueObjectClasses[name];
      } else {
        var split = name.split('/');
        var moduleName = split[0];
        var className = split[1];
        if (!EntityX.isModuleSet(moduleName)) {
          throw new Error('Module [' + moduleName + '] not initialized');
        }
        var currentModule = EntityX.getModule(moduleName);
        ClassObject = require(
            currentModule.getSourceClassLoadPath('valueObject', className));
        _valueObjectClasses[moduleName] = ClassObject;
      }
      return new ClassObject(params);
    },

    /**
     * Set the ValueObject class object for a given name
     * @param {string} name
     * @param {Object} ClassObject
     */
    setValueObject: function(name, ClassObject) {
      _valueObjectClasses[name] = ClassObject;
    }
  };
}();

module.exports = Factory;
