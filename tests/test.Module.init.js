require('should');
var Module = require('../lib/Module');

describe('Module init', function() {
  it('Init without a name', function() {
    try {
      (new Module())._init({});
      throw 'should trown an error';
    } catch (e) {
      e.code.should.be.equal(404);
    }
  });

  it('Init with a name', function() {
    var paths = {
      'entities': 'lib/entities',
      'valueObject': 'lib/entities/values',
      'repositories': 'lib/repositories',
      'helpers': 'lib/helpers'
    };

    var suffixes = {
      'entities': '',
      'valueObject': '',
      'repositories': 'Driver',
      'helpers': 'Helper'
    };
    try {
      var module = new Module();
      module._init({'name': 'ModName'});
      module.name.should.be.equal('ModName');
      module.paths.should.be.eql(paths);
      module.suffixes.should.be.eql(suffixes);
    } catch (e) {
      throw e;
    }
  });

  it('Init with path and suffix', function() {
    var paths = {
      'entities': 'new/entities',
      'valueObject': 'new/valueObject',
      'repositories': 'new/repositories',
      'helpers': 'new/helpers'
    };

    var suffixes = {
      'entities': 'suffEntities',
      'valueObject': 'suffValueObject',
      'repositories': 'suffRepositories',
      'helpers': 'suffHelpers'
    };
    try {
      var module = new Module();
      module._init({'name': 'ModName', paths: paths, suffixes: suffixes});
      module.name.should.be.equal('ModName');
      module.paths.should.be.eql(paths);
      module.suffixes.should.be.eql(suffixes);
    } catch (e) {
      throw e;
    }
  });
});
