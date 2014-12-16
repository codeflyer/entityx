var ErrorX = require('codeflyer-errorx');
var EntityX = require('./EntityX');

var Factory = function() {

  var _classes = {
    'entities': {},
    'repositories': {},
    'services': {},
    'valueObject': {}
  };

  return {
    reset: function() {
      _classes = {
        'entities': {},
        'repositories': {},
        'services': {},
        'valueObject': {}
      };
    },

    /**
     * Resolve name in format ModuleName/ClassName
     * @param {string} name
     * @return {{module: Module, className: *}}
     * @private
     */
    _resolveName: function(name) {
      var split = name.split('/');
      var moduleName = split[0];
      var className = split[1];
      if (!EntityX.isModuleSet(moduleName)) {
        throw new ErrorX(404, 'Module [' + moduleName + '] not initialized');
      }
      var module = EntityX.getModule(moduleName);
      return {module: module, 'className': className};
    },

    _getClassObject: function(type, name) {
      var cacheClassesObj = _classes[type];
      var ClassObject;
      if (cacheClassesObj == null) {
        throw new ErrorX(404, 'Type [' + type + '] not defined');
      }

      if (name in cacheClassesObj) {
        ClassObject = cacheClassesObj[name];
      } else {
        var struct = this._resolveName(name);
        try {
          ClassObject = require(
              struct.module.getSourceClassLoadPath(type, struct.className));
          cacheClassesObj[name] = ClassObject;
        } catch (e) {
          throw new ErrorX(400,
              'Class [' + name + '] of type [' + type + '] not defined', e);
        }
      }
      return ClassObject;
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
      var ClassObject = this._getClassObject('entities', name);
      var retObj = new ClassObject();
      if (id != null) {
        retObj._init(id, details);
      }
      return retObj;
    },

    /**
     * Set the entity class object for a given name
     * @param {string} name
     *      The name of the value object in the format ModuleName/ClassName
     * @param {Object} ClassObject
     */
    setEntity: function(name, ClassObject) {
      _classes.entities[name] = ClassObject;
    },

    /**
     *
     * Get the instance of a repository
     * @param {string} name
     *      The name of the value object in the format ModuleName/ClassName
     * @param {string|number} id
     *      The identifier of the entity
     * @param {Object} details
     *      The details for the initializations
     * @return {Entity}
     */
    getRepository: function(name, id) {
      var ClassObject = this._getClassObject('repositories', name);
      if (id == null) {
        return new ClassObject();
      } else {
        return new ClassObject(id);
      }
    },

    /**
     * Set the repository class object for a given name
     * @param {string} name
     * @param {Object} ClassObject
     */
    setRepository: function(name, ClassObject) {
      _classes.repositories[name] = ClassObject;
    },

    getService: function(name, params) {
      var ClassObject = this._getClassObject('services', name);
      return new ClassObject(params);
    },

    /**
     * Set the services class object for a given name
     * @param {string} name
     * @param {Object} ClassObject
     */
    setService: function(name, ClassObject) {
      _classes.services[name] = ClassObject;
    },

    /**
     * Get the instance of the value object
     * @param {string} name
     *          The name of the value object in the format ModuleName/ClassName
     * @param {Object} params the values for the object inizialiation
     * @return {ClassObject}
     */
    getValueObject: function(name, params) {
      var ClassObject = this._getClassObject('valueObject', name);
      return new ClassObject(params);
    },

    /**
     * Set the ValueObject class object for a given name
     * @param {string} name
     * @param {Object} ClassObject
     */
    setValueObject: function(name, ClassObject) {
      _classes.valueObject[name] = ClassObject;
    }
  };
}();

module.exports = Factory;
