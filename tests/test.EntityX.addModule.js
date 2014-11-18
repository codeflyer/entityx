require('should');
var EntityX = require('../lib/EntityX');
var path = require('path');

describe('EntityX adding modules', function() {
  var rootPath = path.join(__dirname, '..');

  beforeEach(function() {
    EntityX._reset();
  });

  it('Module exists and is valid', function() {
    EntityX.setApplicationRoot(rootPath);
    EntityX.addModule('tests/classesTest');
    EntityX.getModule('TestModule').name.should.be.equal('TestModule');
  });

  it('Module folder not exists', function() {
    EntityX.setApplicationRoot(rootPath);
    (function() {
      EntityX.addModule('tests/classesNotValid');
    }).should.throw('Module Path not found [' +
        rootPath + '/tests/classesNotValid]');
  });

  it('Config file not exists', function() {
    EntityX.setApplicationRoot(rootPath);
    try {
      EntityX.addModule('tests/classesTest/lib');
    } catch (e) {
      e.code.should.be.equal(404);
    }
  });

  it('Module already registered', function() {
    EntityX.setApplicationRoot(rootPath);
    EntityX.addModule('tests/classesTest');
    try {
      EntityX.addModule('tests/classesTest');
    } catch (e) {
      e.code.should.be.equal(100);
    }
  });

});
