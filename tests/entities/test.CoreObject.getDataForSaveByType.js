var path = require('path');
var EntityX = require('../../lib/EntityX');
var Factory = require('../../lib/Factory');
var CoreObject = require('../../lib/entities/CoreObject');

describe('Object: getDataForSaveByType', function() {

  beforeEach(function() {
    EntityX._reset();
    EntityX.addModule(path.join(__dirname, '..', 'classesTest'));
  });

  it('Data string', function() {
    var object = new CoreObject();
    var result = object._getDataForSaveByType('field1');
    result.should.be.equal('field1');
  });

  it('Data number', function() {
    var object = new CoreObject();
    var result = object._getDataForSaveByType(10);
    result.should.be.equal(10);
  });

  it('Data boolean', function() {
    var object = new CoreObject();
    var result = object._getDataForSaveByType(true);
    result.should.be.true;
  });

  it('Data entity', function() {
    var object = new CoreObject();
    var check = Factory.getEntity('TestModule/EntityInherit', 1);
    var result = object._getDataForSaveByType(check);
    result.should.be.eql({_id: 1});
  });

  it('Data entity list', function() {
    var object = new CoreObject();
    var checkList = [
      Factory.getEntity('TestModule/EntityInherit', 1),
      Factory.getEntity('TestModule/EntityInherit', 2),
      Factory.getEntity('TestModule/EntityInherit', 3)
    ];
    var result = object._getDataForSaveByType(checkList);
    result.should.be.eql([{_id: 1}, {_id: 2}, {_id: 3}]);
  });

})
;
