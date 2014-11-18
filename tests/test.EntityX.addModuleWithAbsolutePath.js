require('should');
var sinon = require('sinon');
var path = require('path');
var EntityX = require('../lib/EntityX');

describe('EntityX addModuleWithAbsolutePath', function() {
  var sandbox;

  beforeEach(function() {
    EntityX._reset();
    sandbox = sinon.sandbox.create();
  });

  afterEach(function() {
    sandbox.restore();
  });

  it('Application root not initialized', function() {
    var absPath = path.join(__dirname, 'somePath');
    try {
      EntityX.addModuleWithAbsolutePath(absPath);
      throw 'should thrown an error';
    } catch (e) {
      e.code.should.be.equal(400);
    }
  });

  it('Module is placed below the root', function() {
    var absPath = path.join(__dirname, 'somePath');
    EntityX.setApplicationRoot(__dirname);
    var addModuleStub = sandbox.stub(EntityX, 'addModule');
    EntityX.addModuleWithAbsolutePath(absPath);
    addModuleStub.calledWith('somePath').should.be.true;
  });

  it('Module is placed many folder below the root', function() {
    var absPath = path.join(__dirname, 'folder1', 'folder2', 'folder3');
    EntityX.setApplicationRoot(__dirname);
    var addModuleStub = sandbox.stub(EntityX, 'addModule');
    EntityX.addModuleWithAbsolutePath(absPath);
    addModuleStub.calledWith('folder1/folder2/folder3').should.be.true;
  });

  it('Module is not placed below the root', function() {
    var absPath = path.join(__dirname, '..', 'folder1', 'folder2', 'folder3');
    EntityX.setApplicationRoot(__dirname);
    var addModuleStub = sandbox.stub(EntityX, 'addModule');
    EntityX.addModuleWithAbsolutePath(absPath);
    addModuleStub.calledWith('../folder1/folder2/folder3').should.be.true;
  });
});
