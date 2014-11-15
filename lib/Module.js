var ErrorMessage = require('ErrorX');
var path = require('path');

function Module() {
  this._relativePath = null;
  this._applicationRoot = null;
  this.name = null;

  this.paths = {
    'entities': 'lib/entities',
    'valueObject': 'lib/entities/values',
    'repositories': 'lib/repositories',
    'helpers': 'lib/helpers'
  };

  this.suffixes = {
    'entities': '',
    'valueObject': '',
    'repositories': 'Driver',
    'helpers': 'Helper'
  };
}

Module.prototype.setRelativePath = function(relativePath) {
  this._relativePath = relativePath;
};

Module.prototype.setApplicationRoot = function(applicationRoot) {
  this._applicationRoot = applicationRoot;
};

Module.prototype._init = function(config) {
  if (config.name == null) {
    throw new ErrorMessage(404, 'Name not found in config');
  }
  this.name = config.name;

  if (config.paths != null) {
    this.paths.entities =
        config.paths.entities || this.paths.entities;
    this.paths.valueObject =
        config.paths.valueObject || this.paths.valueObject;
    this.paths.repositories =
        config.paths.repositories || this.paths.repositories;
    this.paths.helpers =
        config.paths.helpers || this.paths.helpers;
  }

  if (config.suffixes != null) {
    this.suffixes.entities =
        config.suffixes.entities || this.suffixes.entities;
    this.suffixes.valueObject =
        config.suffixes.valueObject || this.suffixes.valueObject;
    this.suffixes.repositories =
        config.suffixes.repositories || this.suffixes.repositories;
    this.suffixes.helpers =
        config.suffixes.helpers || this.suffixes.helpers;
  }
};

Module.prototype.getName = function() {
  return this.name;
};

Module.prototype.getSourceClassLoadPath = function(type, className) {
  return path.join(
      this._applicationRoot,
      this._relativePath,
      this.paths[type],
      className + this.suffixes[type]);
};

module.exports = Module;
