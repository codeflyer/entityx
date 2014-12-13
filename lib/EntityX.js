var path = require('path');
var fs = require('fs');
var ErrorX = require('ErrorX');
var Module = require('./Module');

var EntityX = function() {

  /**
   * The module list
   * @type {{}}
   * @private
   */
  var _modules = {};

  return {
    _reset: function() {
      _modules = {};
    },

    /**
     * Set the absolute path for the module
     * @param {string} absolutePath
     */
    addModule: function(absolutePath) {
      absolutePath = path.normalize(absolutePath);
      var moduleStruct;
      try {
        fs.realpathSync(absolutePath);
      } catch (e) {
        throw new ErrorX(404,
            'Module Path not found [' + absolutePath + ']', e);
      }
      try {
        var configFilePath = path.join(absolutePath, 'module.js');
        moduleStruct = require(configFilePath);
      } catch (e) {
        throw new ErrorX(404,
            'The config file ' + configFilePath + ' was not found', e);
      }
      if (_modules[moduleStruct.name] != null) {
        throw new ErrorX(100,
            'Module ' + moduleStruct.name + ' already registered');
      }
      var moduleToAdd = new Module();
      moduleToAdd.setAbsolutePath(absolutePath);
      moduleToAdd._init(moduleStruct);
      _modules[moduleStruct.name] = moduleToAdd;
    },

    /**
     * Retrieve the module object
     * @param {string} moduleName
     * @return {Module}
     */
    getModule: function(moduleName) {
      return _modules[moduleName];
    },

    /**
     * Return the list of registered modules
     * @return {Array<string>}
     */
    getRegisteredModulesName: function() {
      return Object.keys(_modules);
    },

    /**
     * Check if module is set
     * @param {string} moduleName
     * @return {boolean}
     */
    isModuleSet: function(moduleName) {
      return moduleName in _modules;
    }

  };
}();

module.exports = EntityX;
