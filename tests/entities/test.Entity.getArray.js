var path = require('path');
var EntityX = require('./../../lib/EntityX');
var Entity = require('./../../lib/entities/Entity');

describe('Object: getArray', function() {

  beforeEach(function() {
    EntityX._reset();
    EntityX.addModule(path.join(__dirname, '..', 'classesTest'));
  });

  it('Get array without fields', function() {
    var obj = new Entity({'useTimestamp': true});
    obj._isLoad = true;
    obj._setData('entity', 1);
    obj._setData('mockData1', 'mock1');
    obj._setData('mockData2', 'mock2');
    obj.getArray().then(
        function(results) {
          results.entity.should.be.equal(1);
          results.mockData1.should.be.equal('mock1');
          results.mockData2.should.be.equal('mock2');
        }
    );
  });

  it('Get array with fields not array', function() {
    var obj = new Entity({'useTimestamp': true});
    obj._isLoad = true;
    obj._setData('entity', 1);
    obj._setData('mockData1', 'mock1');
    obj._setData('mockData2', 'mock2');
    obj.getArray('mockErrValue').then(
        function(results) {
          results.entity.should.be.equal(1);
          results.mockData1.should.be.equal('mock1');
          results.mockData2.should.be.equal('mock2');
        }
    );
  });

  it('Get array with fields not exists', function() {
    var obj = new Entity({'useTimestamp': true});
    obj._isLoad = true;
    obj._setData('entity', 1);
    obj._setData('mockData1', 'mock1');
    obj._setData('mockData2', 'mock2');
    obj.getArray(['mockErrValue']).catch(
        function(err) {
          err.code.should.be.equal(345);
          err.message.should.be.equal('Field not valid');
        }
    );
  });

  it('Get array with fields valid', function() {
    var obj = new Entity({'useTimestamp': true});
    obj._isLoad = true;
    obj._setData('entity', 1);
    obj._setData('mockData1', 'mock1');
    obj._setData('mockData2', 'mock2');
    obj.getArray(['entity', 'mockData1']).then(
        function(results) {
          results.entity.should.be.equal(1);
          results.mockData1.should.be.equal('mock1');
        }
    );
  });
});
