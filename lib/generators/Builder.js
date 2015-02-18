var Builder = function() {

  var _capitalizeName = function(name) {
    return name.substr(0, 1).toUpperCase() + name.substr(1);
  };

  function _localRequire(type, generatorFile) {
    try {
      return require(
          './code/' + type + '/' + generatorFile);
    } catch (e) {
      return require(
          './code/default/' + generatorFile);
    }
  }

  function _buildEntity(initStruct, classDefinition) {
    var functionName;
    var codeGen;
    var name;

    if (classDefinition == null) {
      // Create the constructor
      codeGen = _localRequire('default', 'constructorEntity');
      classDefinition = codeGen(initStruct);
    }

    for (var i = 0; i < initStruct.attributes.length; i++) {
      name = initStruct.attributes[i].name;
      var capName = _capitalizeName(initStruct.attributes[i].name);
      if (initStruct.attributes[i].accessors.indexOf('get') > -1) {
        functionName = 'get' + capName;
        codeGen = _localRequire(initStruct.attributes[i].type, 'get');
        classDefinition.prototype[functionName] = codeGen(name);
      }
      if (initStruct.attributes[i].accessors.indexOf('is') > -1) {
        functionName = 'is' + capName;
        codeGen = _localRequire(initStruct.attributes[i].type, 'is');
        classDefinition.prototype[functionName] = codeGen(name);
      }
      if (initStruct.attributes[i].accessors.indexOf('getAsync') > -1) {
        functionName = 'get' + capName + 'Async';
        codeGen = _localRequire(initStruct.attributes[i].type, 'getAsync');
        classDefinition.prototype[functionName] = codeGen(name);
      }
      if (initStruct.attributes[i].accessors.indexOf('isAsync') > -1) {
        functionName = 'is' + capName + 'Async';
        codeGen = _localRequire(initStruct.attributes[i].type, 'isAsync');
        classDefinition.prototype[functionName] = codeGen(name);
      }
      if (initStruct.attributes[i].accessors.indexOf('set') > -1) {
        functionName = 'set' + capName;
        codeGen = _localRequire(initStruct.attributes[i].type, 'set');
        classDefinition.prototype[functionName] = codeGen(name);
      }
      if (initStruct.attributes[i].accessors.indexOf('setIs') > -1) {
        functionName = 'setIs' + capName;
        codeGen = _localRequire(initStruct.attributes[i].type, 'setIs');
        classDefinition.prototype[functionName] = codeGen(name);
      }
    }

    var stringFunction = '';
    for (i = 0; i < initStruct.attributes.length; i++) {
      name = initStruct.attributes[i].name;
      if (!initStruct.attributes[i].excludeFromLoad) {
        codeGen = _localRequire(initStruct.attributes[i].type, 'loadDetails');
        stringFunction += codeGen(initStruct.attributes[i]);
      }
    }
    stringFunction += 'return details;\n';

    /*jshint -W054 */
    classDefinition.prototype._loadDetailsBefore =
        new Function('details', stringFunction);

    return classDefinition;
  }

  function _buildValueObject(initStruct, classDefinition) {
    var functionName;
    var codeGen;
    var name;

    if (classDefinition == null) {
      // Create the constructor
      codeGen = _localRequire('default', 'constructorValueObject');
      classDefinition = codeGen(initStruct);
    }

    for (var i = 0; i < initStruct.attributes.length; i++) {
      name = initStruct.attributes[i].name;
      var capName = _capitalizeName(initStruct.attributes[i].name);
      if (initStruct.attributes[i].accessors.indexOf('get') > -1) {
        functionName = 'get' + capName;
        codeGen = _localRequire(initStruct.attributes[i].type, 'get');
        classDefinition.prototype[functionName] = codeGen(name);
      }
    }

    var stringFunction = '';
    for (i = 0; i < initStruct.attributes.length; i++) {
      name = initStruct.attributes[i].name;
      if (!initStruct.attributes[i].excludeFromLoad) {
        codeGen = _localRequire(initStruct.attributes[i].type, 'loadDetails');
        stringFunction += codeGen(initStruct.attributes[i]);
      }
    }
    stringFunction += 'return details;\n';

    /*jshint -W054 */
    classDefinition.prototype._loadDetails =
        new Function('details', stringFunction);

    return classDefinition;
  }

  function _buildRepository(initStruct, classDefinition) {
    var codeGen;

    if (classDefinition == null) {
      // Create the constructor
      codeGen = _localRequire('default', 'constructorRepository');
      classDefinition = codeGen(initStruct);
    }

    return classDefinition;
  }

  function _buildService(initStruct, classDefinition) {
    var codeGen;

    if (classDefinition == null) {
      // Create the constructor
      codeGen = _localRequire('default', 'constructorService');
      classDefinition = codeGen(initStruct);
    }

    return classDefinition;
  }

  return {
    buildEntity: _buildEntity,
    buildValueObject: _buildValueObject,
    buildRepository: _buildRepository,
    buildService: _buildService
  };
}();

module.exports = Builder;
