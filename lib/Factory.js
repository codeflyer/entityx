var path = require('path');
var ObjectID = require('mongodb').ObjectID;
var fs = require('fs');
var EntityX = require('./EntityX');

var Factory = function() {

  var _entityClasses = {};

  var _driverClasses = {};

  var _helperClasses = {};

  return {

    reset: function() {
      _entityClasses = {};
      _driverClasses = {};
      _helperClasses = {};
    },

    /**
     *
     * @param {string} name
     * @param {string|number} id
     * @param {Object} details
     * @return {Entity}
     */
    getModel: function(name, id, details) {
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
        if (id.constructor.name == 'ObjectID') {
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
     * @param {Object} ClassObject
     */
    setModel: function(name, ClassObject) {
      _entityClasses[name] = ClassObject;
    },

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
    }
  };
}();

module.exports = Factory;
