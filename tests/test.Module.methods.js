var Module = require('../lib/Module');

describe('Module methods', function() {

  it('Check getname', function() {
    try {
      var module = new Module();
      module._init({'name': 'ModName'});
      module.getName().should.be.equal('ModName');
    } catch (e) {
      throw e;
    }
  });

  it('Set relative path', function() {
    try {
      var module = new Module();
      module.setAbsolutePath('somePath');
      module._absolutePath.should.be.equal('somePath');
    } catch (e) {
      throw e;
    }
  });

  it('get source class load path', function() {
    try {
      var module = new Module();
      module.setAbsolutePath('somePath');
      var sourceClass = module.getSourceClassLoadPath('entities', 'MyClass');
      sourceClass.should.be.equal('somePath/lib/entities/MyClass');
    } catch (e) {
      throw e;
    }
  });

  it('get source class load path with wrong type', function() {
    try {
      var module = new Module();
      module.setAbsolutePath('somePath');
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
