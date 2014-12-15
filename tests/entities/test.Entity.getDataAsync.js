var path = require('path');
var EntityX = require('./../../lib/EntityX');
var Entity = require('./../../lib/entities/Entity');
var Factory = require('../../lib/Factory');
var sinon = require('sinon');
var Q = require('q');

describe('Object: getDataAsync', function() {

  beforeEach(function() {
    EntityX._reset();
    EntityX.addModule(path.join(__dirname, '..', 'classesTest'));
  });

  it('Get dataAsync loaded', function() {
    var obj = new Entity({'useTimestamp': true});
    obj._isLoad = true;
    obj._setData('entity', 1);
    obj._getDataAsync('entity').then(
        function(result) {
          result.should.be.equal(1);
        }
    );
  });

  it('Get dataAsync not loaded', function() {
    var obj = Factory.getEntity('TestModule/EntityInherit', 1);
    var stub = sinon.stub(obj, '_internalLoadDetails');
    /* jshint newcap:false */
    stub.returns(Q(obj));
    obj._setData('entity', 100);
    obj._isLoad = false;
    obj._getDataAsync('entity').then(
        function(result) {
          stub.called.should.be.true;
          stub.calledWith().should.be.true;
          result.should.be.equal(100);
        }
    );
  });
});
