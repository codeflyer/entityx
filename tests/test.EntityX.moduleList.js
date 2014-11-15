require('should');
var EntityX = require('../lib/EntityX');
var Factory = require('../lib/Factory');
var path = require('path');

describe('EntityX: ModuleList', function() {
  var rootPath = path.join(__dirname, '..');

  beforeEach(function() {
    EntityX._reset();
    Factory.reset();
  });

  it('GetModule list (empty)', function() {
    EntityX.setApplicationRoot(rootPath);
    EntityX.getRegisteredModulesName().should.be.eql([]);
  });

  it('GetModule list (not empty)', function() {
    EntityX.setApplicationRoot(rootPath);
    EntityX.addModule('tests/classesTest');
    EntityX.getRegisteredModulesName().length.should.be.eql(1);
    EntityX.getRegisteredModulesName().should.be.eql(['TestModule']);
  });

});
