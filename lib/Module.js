var ErrorX = require('codeflyer-errorx');
var path = require('path');

function Module() {
  this._absolutePath = null;
  this.name = null;

  this.paths = {
    'entities': 'lib/entities',
    'valueObject': 'lib/entities/values',
    'repositories': 'lib/repositories',
    'services': 'lib/services'
  };

  this.suffixes = {
    'entities': '',
    'valueObject': '',
    'repositories': 'Driver',
    'services': 'Service'
  };
}

Module.prototype.setAbsolutePath = function(absolutePath) {
  this._absolutePath = absolutePath;
};

Module.prototype._init = function(config) {
  if (config.name == null) {
    throw new ErrorX(404, 'Name not found in config');
  }
  this.name = config.name;

  if (config.paths != null) {
    this.paths.entities =
        config.paths.entities || this.paths.entities;
    this.paths.valueObject =
        config.paths.valueObject || this.paths.valueObject;
    this.paths.repositories =
        config.paths.repositories || this.paths.repositories;
    this.paths.services =
        config.paths.services || this.paths.services;
  }

  if (config.suffixes != null) {
    this.suffixes.entities =
        config.suffixes.entities || this.suffixes.entities;
    this.suffixes.valueObject =
        config.suffixes.valueObject || this.suffixes.valueObject;
    this.suffixes.repositories =
        config.suffixes.repositories || this.suffixes.repositories;
    this.suffixes.services =
        config.suffixes.services || this.suffixes.services;
  }
};

Module.prototype.getName = function() {
  return this.name;
};

Module.prototype.getSourceClassLoadPath = function(type, className) {
  if (this.paths[type] == null || this.suffixes[type] == null) {
    throw new ErrorX(404, 'class type [' + type + '] not found');
  }
  return path.join(
      this._absolutePath,
      this.paths[type],
      className + this.suffixes[type]);
};

module.exports = Module;
