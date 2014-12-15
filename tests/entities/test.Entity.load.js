var path = require('path');
var EntityX = require('../../lib/EntityX');
var Factory = require('../../lib/Factory');
var errorCodes = require('../../lib/errorCodes');
var sinon = require('sinon');
var Q = require('q');

describe('Object: load', function() {

  beforeEach(function() {
    EntityX._reset();
    EntityX.addModule(path.join(__dirname, '..', 'classesTest'));
  });

  it('_loadDetails', function() {
    var obj = Factory.getEntity('TestModule/EntityInheritNoInteface', 1);
    try {
      obj._loadDetails();
      throw new Error('should be thrown');
    } catch (e) {
      e.code.should.be.equal(errorCodes.INTERFACE_NOT_INHERITED);
    }
  });

  it('check isLoad == false', function() {
    var model = Factory.getEntity('TestModule/EntityInherit', 1);
    model.isLoad().should.be.false;
  });

  it('check isLoad == true', function() {
    var model = Factory.getEntity('TestModule/EntityInherit', 1);
    model._isLoad = true;
    model.isLoad().should.be.true;
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
