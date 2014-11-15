require('should');
var EntityX = require('../lib/EntityX');
var path = require('path');

describe('EntityX Initialization', function() {
  beforeEach(function() {
    EntityX._reset();
  });

  it('The root is empty', function() {
    (EntityX.getApplicationRoot() == null).should.be.true;
  });

  it('Set the root of the application', function() {
    EntityX.setApplicationRoot(__dirname);
    EntityX.getApplicationRoot().should.be.equal(__dirname);
  });
});
