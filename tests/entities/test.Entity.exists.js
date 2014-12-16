var sinon = require('sinon');

var path = require('path');
var Promise = require('bluebird');
var ErrorX = require('codeflyer-errorx');
var EntityX = require('../../lib/EntityX');
var Entity = require('../../lib/entities/Entity');

describe('Entity: exists', function() {

  beforeEach(function() {
    EntityX._reset();
    EntityX.addModule(path.join(__dirname, '..', 'classesTest'));
  });

  it('exists == true', function(done) {
    var model = new Entity({
      'useTimestamp': true,
      repositoryName: 'TestModule/Inherit'
    });
    var MockDriver = function(id) {
      this.exists = function() {
        return Promise.resolve(true);
      };
    };
    var driverStub = sinon.stub(model, '_getRepository');
    driverStub.returns(new MockDriver(1));

    model.exists().then(
        function(exists) {
          exists.should.be.true;
          done();
        }
    ).catch(function(err) {
          done(err);
        });
  });

  it('exists == false', function(done) {
    var model = new Entity({
      'useTimestamp': true,
      repositoryName: 'TestModule/Inherit'
    });
    var MockDriver = function(id) {
      this.exists = function() {
        return Promise.resolve(false);
      };
    };
    var driverStub = sinon.stub(model, '_getRepository');
    driverStub.returns(new MockDriver(1));

    model.exists().then(
        function(exists) {
          exists.should.be.false;
          done();
        }
    ).catch(function(err) {
          done(err);
        });
  });

  it('driver exception', function(done) {
    var model = new Entity({
      'useTimestamp': true,
      repositoryName: 'TestModule/Inherit'
    });
    var MockDriver = function(id) {
      this.exists = function() {
        return Promise.reject(new ErrorX(1, 'err'));
      };
    };
    var driverStub = sinon.stub(model, '_getRepository');
    driverStub.returns(new MockDriver(1));

    model.exists().then(
        function(exists) {
          done('Should thrown an error');
        }
    ).catch(function(err) {
          err.code.should.be.equal(1);
          done();
        });
  });
});
