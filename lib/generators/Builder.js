var util = require('util');
var Entity = require('../entities/Entity');

var Builder = function() {

  var _capitalizeName = function(name) {
    return name.substr(0, 1).toUpperCase() + name.substr(1);
  };

  function _build(classDefinition, initStruct) {
    for (var i = 0; i < initStruct.attributes.length; i++) {
      var name = initStruct.attributes[i].name;
      var capName = _capitalizeName(initStruct.attributes[i].name);
      if (initStruct.attributes[i].accessors.indexOf('get') > -1) {
        var functionName = 'get' + capName;
        var codeGen = require(
            './code/' + initStruct.attributes[i].type + '/get');
        classDefinition.prototype[functionName] = codeGen(name);
      }
      if (initStruct.attributes[i].accessors.indexOf('getSync') > -1) {
        var functionName = 'get' + capName + 'Sync';
        var codeGen = require(
            './code/' + initStruct.attributes[i].type + '/getSync');
        classDefinition.prototype[functionName] = codeGen(name);
      }
      if (initStruct.attributes[i].accessors.indexOf('set') > -1) {
        var functionName = 'set' + capName;
        var codeGen = require(
            './code/' + initStruct.attributes[i].type + '/setSync');
        classDefinition.prototype[functionName] = codeGen(name);
      }
    }

    for (var i = 0; i < initStruct.attributes.length; i++) {
      var name = initStruct.attributes[i].name;
      var stringFunction = '';
      if (!initStruct.attributes[i].excludeFromLoad) {
        var codeGen = require(
            './code/' + initStruct.attributes[i].type + '/loadDetails');
        stringFunction += codeGen(name);
      }
      stringFunction += 'return details;\n';

      classDefinition.prototype['_loadDetails'] =
          new Function('details', stringFunction);
    }
  }

  return {
    build: _build
  }
}();

module.exports = Builder;
