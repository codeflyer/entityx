require('should');
var path = require('path');
var Module = require('../lib/Module');

describe('Module methods', function() {
  var rootPath = path.join(__dirname, '..');

  it('Check getname', function() {
    try {
      var module = new Module();
      module._init({'name': 'ModName'});
      module.getName().should.be.equal('ModName');
    } catch (e) {
      throw e;
    }
  });

  it('Set and check application root', function() {
    var module = new Module();
    module.setApplicationRoot(rootPath);
    module._applicationRoot.should.be.equal(rootPath);
  });

  it('Set relative path', function() {
    try {
      var module = new Module();
      module.setRelativePath('somePath');
      module._relativePath.should.be.equal('somePath');
    } catch (e) {
      throw e;
    }
  });

  it('get source class load path', function() {
    try {
      var module = new Module();
      module.setApplicationRoot(rootPath);
      module.setRelativePath('somePath');
      var sourceClass = module.getSourceClassLoadPath('entities', 'MyClass');
      sourceClass.should.be.equal(rootPath + '/somePath/lib/entities/MyClass');
    } catch (e) {
      throw e;
    }
  });

  it('get source class load path with wrong type', function() {
    try {
      var module = new Module();
      module.setApplicationRoot(rootPath);
      module.setRelativePath('somePath');
      try {
        module.getSourceClassLoadPath('notexistenttype', 'MyClass');
        throw 'should trown an error';
      } catch (e) {
        e.code.should.be.equal(404);
        e.message.should.be.equal('class type [notexistenttype] not found');
      }
    } catch (e) {
      throw e;
    }
  });
});
