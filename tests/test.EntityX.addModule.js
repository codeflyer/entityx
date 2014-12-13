require('should');
var EntityX = require('../lib/EntityX');
var path = require('path');

describe('EntityX adding modules', function() {
  var rootPath = path.join(__dirname, '..');

  beforeEach(function() {
    EntityX._reset();
  });

  it('Module exists and is valid', function() {
    EntityX.addModule(path.join(rootPath, 'tests/classesTest'));
    EntityX.getModule('TestModule').name.should.be.equal('TestModule');
  });

  it('Module folder not exists', function() {
    (function() {
      EntityX.addModule(path.join(rootPath, 'tests/classesNotValid'));
    }).should.throw('Module Path not found [' +
        rootPath + '/tests/classesNotValid]');
  });

  it('Config file not exists', function() {
    try {
      EntityX.addModule(path.join(rootPath, 'tests/classesTest/lib'));
    } catch (e) {
      e.code.should.be.equal(404);
    }
  });

  it('Module already registered', function() {
    EntityX.addModule(path.join(rootPath, 'tests/classesTest'));
    try {
      EntityX.addModule(path.join(rootPath, 'tests/classesTest'));
    } catch (e) {
      e.code.should.be.equal(100);
    }
  });

});
