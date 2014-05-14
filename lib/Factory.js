var path = require('path');
var ObjectID = require('mongodb').ObjectID;
var fs = require('fs');

var Factory = function() {
    /**
     * The application root
     * @type {string|null}
     * @private
     */
    var _applicationRoot = null;

    /**
     * The relative (to the root) path for each module
     * @type {{}}
     * @private
     */
    var _modulesPath = {};

    var _entityClasses = {};

    var _driverClasses = {};

    return {
        reset : function() {
            _modulesPath = {};
            _applicationRoot = null;
        },

        /**
         * Set the application root
         * @param {string} path
         */
        setApplicationRoot : function(path) {
            var realPath = fs.realpathSync(path);
            _applicationRoot = realPath;
        },

        /**
         * Get the application root
         * @return {string}
         */
        getApplicationRoot : function() {
            return _applicationRoot;
        },

        /**
         * Set the relative path for the module
         * @param moduleName
         * @param relativePath
         */
        setModule : function(moduleName, relativePath) {
            fs.realpathSync(path.join(this.getApplicationRoot(), relativePath));
            _modulesPath[moduleName] = relativePath;
        },

        /**
         * Retrieve the path of the module
         * @param moduleName
         * @return {*}
         */
        getModulePath : function(moduleName) {
            return path.join(_applicationRoot, _modulesPath[moduleName]);
        },

        /**
         * Return the list of registered modules
         * @return {Array}
         */
        getModules : function() {
            return Object.keys(_modulesPath);
        },

        /**
         * Check if module is set
         * @param moduleName
         * @return {boolean}
         */
        isModuleSet : function(moduleName) {
            return moduleName in _modulesPath;
        },

        /**
         *
         * @param name
         * @param id
         * @param details
         * @return {Entity}
         */
        getModel : function(name, id, details) {
            var ClassObject;
            if(name in _entityClasses) {
                ClassObject = _entityClasses[name];
            } else {
                var split = name.split('/');
                var module = split[0];
                var className = split[1];
                if(!this.isModuleSet(module)) {
                    throw new Error("Module [" + module + "] not initialized");
                }
                ClassObject = require(path.join(this.getModulePath(module), 'lib', 'entities', className));
                _entityClasses[name] = ClassObject;
            }
            var retObj = new ClassObject();
            if(id != null) {
                if(id instanceof ObjectID) {
                    retObj._init(id.toString(), details);
                } else {
                    retObj._init(id, details);
                }
            }
            return retObj;
        },

        /**
         * Set the entity class object for a given name
         * @param name
         * @param ClassObject
         */
        setModel : function(name, ClassObject) {
            _entityClasses[name] = ClassObject;
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
                    throw new Error("Module [" + module + "] not initialized");
                }
                ClassObject = require(path.join(this.getModulePath(module), 'lib', 'repositories', className + 'Driver'));
                _driverClasses[name] = ClassObject;
            }
            if(id == null) {
                return new ClassObject();
            } else {
                return new ClassObject(id);
            }

        },

        /**
         * Set the driver class object for a given name
         * @param name
         * @param ClassObject
         */
        setDriver : function(name, ClassObject) {
            _driverClasses[name] = ClassObject;
        }
    };
}();

module.exports = Factory;
