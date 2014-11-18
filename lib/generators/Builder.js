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

  function _build(classDefinition, initStruct) {
    var functionName;
    var codeGen;
    var name;
    for (var i = 0; i < initStruct.attributes.length; i++) {
      name = initStruct.attributes[i].name;
      var capName = _capitalizeName(initStruct.attributes[i].name);
      if (initStruct.attributes[i].accessors.indexOf('get') > -1) {
        functionName = 'get' + capName;
        codeGen = _localRequire(initStruct.attributes[i].type, 'get');
        classDefinition.prototype[functionName] = codeGen(name);
      }
      if (initStruct.attributes[i].accessors.indexOf('getSync') > -1) {
        functionName = 'get' + capName + 'Sync';
        codeGen = _localRequire(initStruct.attributes[i].type, 'getSync');
        classDefinition.prototype[functionName] = codeGen(name);
      }
      if (initStruct.attributes[i].accessors.indexOf('set') > -1) {
        functionName = 'set' + capName;
        codeGen = _localRequire(initStruct.attributes[i].type, 'setSync');
        classDefinition.prototype[functionName] = codeGen(name);
      }
    }

    for (i = 0; i < initStruct.attributes.length; i++) {
      name = initStruct.attributes[i].name;
      var stringFunction = '';
      if (!initStruct.attributes[i].excludeFromLoad) {
        codeGen = _localRequire(initStruct.attributes[i].type, 'loadDetails');
        stringFunction += codeGen(name);
      }
      stringFunction += 'return details;\n';

      /*jshint -W054 */
      classDefinition.prototype._loadDetails =
          new Function('details', stringFunction);
    }
  }

  return {
    build: _build
  };
}();

module.exports = Builder;
