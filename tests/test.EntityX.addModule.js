require('should');
var EntityX = require('../lib/EntityX');
var path = require('path');

describe('EntityX adding modules', function() {
  var rootPath = path.join(__dirname, '..');

  beforeEach(function() {
    EntityX._reset();
  });

  it('Set module (valid)', function() {
    EntityX.setApplicationRoot(rootPath);
    EntityX.addModule('tests/classesTest');
    EntityX.getModule('TestModule').name.should.be.equal('TestModule');
  });

  it('Set Module (not valid)', function() {
    EntityX.setApplicationRoot(rootPath);
    (function() {
      EntityX.addModule('tests/classesNotValid');
    }).should.throw('Module Path not found [' +
        rootPath + '/tests/classesNotValid]');
  });
});
