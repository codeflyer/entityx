require('should');
var path = require('path');
var EntityX = require('../../lib/EntityX');
var Factory = require('../../lib/Factory');
var sinon = require('sinon');
var Q = require('q');

describe('Object: _internalLoadDetails', function() {

  beforeEach(function() {
    EntityX._reset();
    EntityX.addModule(path.join(__dirname, '..', 'classesTest'));
  });

  it('Check isLoad after loading', function(done) {
    var mockLoad = function(details) {
      details.name.should.be.equal(1);
    };

    var model = Factory.getEntity('TestModule/EntityInherit', 1);
    model._isLoad.should.be.false;
    var spyDriver = sinon.spy(model, '_getRepository');
    var stubLoadDetail = sinon.stub(model, '_loadDetails', mockLoad);
    model.load({name: 1}).then(
        function() {
          spyDriver.called.should.be.false;
          stubLoadDetail.called.should.be.true;
          stubLoadDetail.calledWith({name: 1}).should.be.true;
          model._isLoad.should.be.true;
          done();
        }
    ).catch(function(err) {
          done(err);
        });
  });

  it('Load entity with injections', function(done) {
    var mockLoad = function(details) {
      details.name.should.be.equal(1);
    };

    var model = Factory.getEntity('TestModule/EntityInherit', 1);
    var spyDriver = sinon.spy(model, '_getRepository');
    var stubLoadDetail = sinon.stub(model, '_loadDetails', mockLoad);
    model.load({name: 1}).then(
        function() {
          spyDriver.called.should.be.false;
          stubLoadDetail.called.should.be.true;
          stubLoadDetail.calledWith({name: 1}).should.be.true;
          model._isLoad.should.be.true;
          done();
        }
    ).catch(function(err) {
          done(err);
        });
  });

  it('Load entity with preload', function(done) {
    var mockLoad = function(details) {
      details.name.should.be.equal(1);
    };

    var model = Factory.getEntity('TestModule/EntityInherit', 1, {name: 1});
    model._preloadDetails.should.be.not.null;
    var spyDriver = sinon.spy(model, '_getRepository');
    var stubLoadDetail = sinon.stub(model, '_loadDetails', mockLoad);
    model.load().then(
        function() {
          spyDriver.called.should.be.false;
          stubLoadDetail.called.should.be.true;
          stubLoadDetail.calledWith({name: 1}).should.be.true;
          (model._preloadDetails == null).should.be.true;
          model._isLoad.should.be.true;
          done();
        }
    ).catch(function(err) {
          done(err);
        });
  });

  it('Load entity from driver Exists', function(done) {
    var loadStruct = {
      '_id': 1,
      'name': 'test 1',
      '_ts': {'created': new Date(), 'modified': new Date(), 'deleted': null}
    };
    var mockDriver = {
      loadEntity: function() {
        /* jshint newcap:false */
        return Q(loadStruct);
      }
    };
    var mockLoad = function(details) {
      details.name.should.be.equal('test 1');
    };

    var model = Factory.getEntity('TestModule/EntityInherit', 1);
    var stubDriver = sinon.stub(model, '_getRepository');
    stubDriver.returns(mockDriver);

    var stubLoadDetail = sinon.stub(model, '_loadDetails', mockLoad);
    model.load().then(
        function() {
          stubDriver.called.should.be.true;
          stubLoadDetail.called.should.be.true;
          stubLoadDetail.calledWith(loadStruct).should.be.true;
          model._isLoad.should.be.true;
          done();
        }
    ).catch(function(err) {
          done(err);
        });
  });

  it('Load entity from driver NOT Exists', function(done) {
    var loadStruct = null;
    var mockDriver = {
      loadEntity: function() {
        /* jshint newcap:false */
        return Q(loadStruct);
      }
    };
    var mockLoad = function(details) {
      details.name.should.be.equal(1);
    };

    var model = Factory.getEntity('TestModule/EntityInherit', 1);
    var stubDriver = sinon.stub(model, '_getRepository');
    stubDriver.returns(mockDriver);

    sinon.stub(model, '_loadDetails', mockLoad);
    model.load().then(
        function() {
          done('error');
        }
    ).catch(function(err) {
          err.code.should.be.equal(404);
          model._isLoad.should.be.false;
          done();
        });
  });

  it('Load entity from driver Exists with TS', function(done) {
    var loadStruct = {
      '_id': 1,
      'name': 'test 1',
      '_ts': {'created': new Date(), 'modified': new Date(), 'deleted': null}
    };
    var mockDriver = {
      loadEntity: function(callback) {
        /* jshint newcap:false */
        return Q(loadStruct);
      }
    };
    var mockLoad = function(details) {
      details.name.should.be.equal('test 1');
    };

    var model = Factory.getEntity('TestModule/EntityInherit', 1);
    var stubDriver = sinon.stub(model, '_getRepository');
    stubDriver.returns(mockDriver);

    var stubUseTimestamp = sinon.stub(model, 'useTimestamp');
    stubUseTimestamp.returns(true);

    var spySetData = sinon.spy(model, '_setData');

    sinon.stub(model, '_loadDetails', mockLoad);
    model.load().then(
        function() {
          spySetData.calledWith('ts', loadStruct._ts);
          done();
        }
    ).catch(function(err) {
          done(err);
        });
  });

  it('Load entity from driver Exists without TS', function(done) {
    var loadStruct = {
      '_id': 1,
      'name': 'test 1',
      '_ts': {'created': new Date(), 'modified': new Date(), 'deleted': null}
    };
    var mockDriver = {
      loadEntity: function(callback) {
        /* jshint newcap:false */
        return Q(loadStruct);
      }
    };

    var model = Factory.getEntity('TestModule/EntityInherit', 1);
    var stubDriver = sinon.stub(model, '_getRepository');
    stubDriver.returns(mockDriver);

    var stubUseTimestamp = sinon.stub(model, 'useTimestamp');
    stubUseTimestamp.returns(false);

    var spySetData = sinon.spy(model, '_setData');

    model.load().then(
        function() {
          spySetData.calledWith('ts', loadStruct._ts).should.be.false;
          done();
        }
    ).catch(function(err) {
          done(err);
        });
  });
});
