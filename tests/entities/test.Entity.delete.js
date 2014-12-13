require('should');
var sinon = require('sinon');

var path = require('path');
var Promise = require('bluebird');
var ErrorX = require('ErrorX');
var EntityX = require('../../lib/EntityX');
var Entity = require('../../lib/entities/Entity');

describe('Entity: delete', function() {

  beforeEach(function() {
    EntityX._reset();
    EntityX.addModule(path.join(__dirname, '..', 'classesTest'));
  });

  it('persistent == null', function(done) {
    var model = new Entity({
      'useTimestamp': true,
      repositoryName: 'TestModule/Inherit'
    });
    var MockDriver = function(id) {
      this.delete = function(persistent) {
        persistent.should.be.false;
        return Promise.resolve(true);
      };
    };
    var driverStub = sinon.stub(model, '_getRepository');
    driverStub.returns(new MockDriver(1));

    model.delete().then(
        function(result) {
          result.should.be.true;
          done();
        }
    ).catch(function(err) {
          done(err);
        });
  });

  it('persistent == false', function(done) {
    var model = new Entity({
      'useTimestamp': true,
      repositoryName: 'TestModule/Inherit'
    });
    var MockDriver = function(id) {
      this.delete = function(persistent) {
        persistent.should.be.false;
        return Promise.resolve(true);
      };
    };
    var driverStub = sinon.stub(model, '_getRepository');
    driverStub.returns(new MockDriver(1));

    model.delete(false).then(
        function(result) {
          result.should.be.true;
          done();
        }
    ).catch(function(err) {
          done(err);
        });
  });

  it('persistent == true', function(done) {
    var model = new Entity({
      'useTimestamp': true,
      repositoryName: 'TestModule/Inherit'
    });
    var MockDriver = function(id) {
      this.delete = function(persistent) {
        persistent.should.be.true;
        return Promise.resolve(true);
      };
    };
    var driverStub = sinon.stub(model, '_getRepository');
    driverStub.returns(new MockDriver(1));

    model.delete(true).then(
        function(result) {
          result.should.be.true;
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
      this.delete = function() {
        return Promise.reject(new ErrorX(1, 'err'));
      };
    };
    var driverStub = sinon.stub(model, '_getRepository');
    driverStub.returns(new MockDriver(1));

    model.delete().then(
        function() {
          done('Should thrown an error');
        }
    ).catch(function(err) {
          err.code.should.be.equal(1);
          done();
        });
  });
});
