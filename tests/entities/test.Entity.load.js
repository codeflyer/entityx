require('should');
var path = require('path');
var EntityX = require('../../lib/EntityX');
var Factory = require('../../lib/Factory');
var sinon = require('sinon');
var Q = require('q');

describe('Object: load', function() {

  beforeEach(function() {
    EntityX._reset();
    EntityX.setApplicationRoot(path.join(__dirname, '..'));
    EntityX.addModule('classesTest');
  });

  it('Load entity already loaded', function(done) {
    var model = Factory.getEntity('TestModule/EntityInherit', 1);
    var spy = sinon.spy(model, '_internalLoadDetails');
    model._isLoad = true;
    model.load().then(
        function() {
          spy.called.should.be.false;
          done();
        }
    ).catch(function(err) {
          done(err);
        });
  });

  it('Load entity NOT loaded', function(done) {
    var model = Factory.getEntity('TestModule/EntityInherit', 1);
    var stub = sinon.stub(model, '_internalLoadDetails');
    /* jshint newcap:false */
    stub.returns(Q(model));

    model.load().then(
        function() {
          stub.called.should.be.true;
          stub.calledWith().should.be.true;
          done();
        }
    ).catch(function(err) {
          done(err);
        });
  });

  it('Load entity NOT loaded With InjectedDetails', function(done) {
    var model = Factory.getEntity('TestModule/EntityInherit', 1);
    var stub = sinon.stub(model, '_internalLoadDetails');
    /* jshint newcap:false */
    stub.returns(Q(model));

    model.load({name: 1}).then(
        function() {
          stub.called.should.be.true;
          stub.calledWith({name: 1}).should.be.true;
          done();
        }
    ).catch(function(err) {
          done(err);
        });
  });
});
