var should = require('should');
var EntityX = require('../lib/EntityX');
var Factory = require('../lib/Factory');
var path = require('path');

describe('Factory: initialization', function() {
  var rootPath = path.join(__dirname, '..');

  beforeEach(function() {
    EntityX._reset();
    Factory.reset();
  });

  it('set ApplicationRoot (valid)', function() {
    (function() {
      EntityX.setApplicationRoot(rootPath);
    }).should.not.throw();
  });

  it('Set ApplicationRoot (not valid)', function() {
    (function() {
      EntityX.setApplicationRoot(rootPath + 'err');
    }).should.throw('ENOENT, no such file or directory \'' +
        rootPath + 'err' + '\'');
  });

  it('Get ApplicationRoot', function() {
    (function() {
      EntityX.setApplicationRoot(rootPath);
    }).should.not.throw();
    EntityX.getApplicationRoot().should.be.equal(rootPath);
  });
});
