var path = require('path');
var constant = require('./constant');
var Factory = function() {
    var _applicationRoot = null;

    var _modulesPath = {};

    var _entityClasses = {};

    var _driverClasses = {};

    return {
        reset : function() {
            _modulesPath = {};
            _applicationRoot = null;
        },

        setApplicationRoot : function(path) {
           _applicationRoot = path;
        },

        getApplicationRoot : function() {
            return _applicationRoot;
        },

        setModule : function(moduleName, path) {
            _modulesPath[moduleName] = path;
        },

        getModulePath : function(moduleName) {
            return path.join(_applicationRoot, _modulesPath[moduleName]);
        },

        getModules : function() {
            return Object.keys(_modulesPath);
        },

        isModuleSet : function(moduleName) {
            return moduleName in _modulesPath;
        },

        getModel : function(name, id, details) {
            var ClassObject;
            if(name in _entityClasses) {
                ClassObject = _entityClasses[name];
            } else {
                var split = name.split('/');
                var module = split[0];
                var className = split[1];
                if(!this.isModuleSet(module)) {
                    throw "Module not initialized";
                }
                ClassObject = require(path.join(this.getModulePath(module), 'lib', 'entities', className));
            }
            if(id === undefined) {
                return new ClassObject(constant.NEW_ITEM_IDENTIFIER);
            } else {
                var retObj = new ClassObject(id);
                if(details != null) {
                    retObj._preloadDetails = details;
                }
                return retObj;
            }
        },

        getDriver : function(name, id) {
            var ClassObject;
            if(name in _driverClasses) {
                ClassObject = _driverClasses[name];
            } else {
                var split = name.split('/');
                var module = split[0];
                var className = split[1];
                if(!this.isModuleSet(module)) {
                    throw "Module not initialized";
                }
                ClassObject = require(path.join(this.getModulePath(module), 'lib', 'repositories', className + 'Driver'));
            }
            if(id === undefined) {
                return new ClassObject();
            } else {
                return new ClassObject(id);
            }

        }
    };
}();

module.exports = Factory;
