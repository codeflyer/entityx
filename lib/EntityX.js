var path = require('path');
var fs = require('fs');
var ErrorX = require('ErrorX');
var Module = require('./Module');

var EntityX = function() {

  /**
   * The application root
   * @type {string|null}
   * @private
   */
  var _applicationRoot = null;

  /**
   * The module list
   * @type {{}}
   * @private
   */
  var _modules = {};

  return {
    _reset: function() {
      _modules = {};
      _applicationRoot = null;
    },

    /**
     * Set the application root
     * @param {string} path
     */
    setApplicationRoot: function(path) {
      _applicationRoot = fs.realpathSync(path);
    },

    /**
     * Get the application root
     * @return {string}
     */
    getApplicationRoot: function() {
      return _applicationRoot;
    },

    /**
     * Add the module using an absolutePath
     * @param {string} absolutePath
     */
    addModuleWithAbsolutePath: function(absolutePath) {
      if (this.getApplicationRoot() == null) {
        throw new ErrorX(400, 'Application root not initialized');
      }
      absolutePath = path.normalize(absolutePath);
      var appRoot = path.normalize(this.getApplicationRoot());
      var relativePath = path.relative(appRoot, absolutePath);
      this.addModule(relativePath);
    },

    /**
     * Set the relative path for the module
     * @param {string} relativePath
     */
    addModule: function(relativePath) {
      var moduleStruct;
      try {
        var absolutePath = path.join(this.getApplicationRoot(), relativePath);
        fs.realpathSync(absolutePath);
      } catch (e) {
        throw new ErrorX(404,
            'Module Path not found [' + absolutePath + ']', e);
      }
      try {
        var configFilePath = path.join(
            this.getApplicationRoot(), relativePath, 'module.js');
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
      moduleToAdd.setApplicationRoot(this.getApplicationRoot());
      moduleToAdd.setRelativePath(relativePath);
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
     * Retrieve the path of the module
     * @param {string} moduleName
     * @return {*}
     */
    getModulePath: function(moduleName) {
      return path.join(_applicationRoot, _modules[moduleName]);
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
