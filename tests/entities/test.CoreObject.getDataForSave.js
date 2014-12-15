var sinon = require('sinon');

var path = require('path');
var ErrorX = require('ErrorX');
var EntityX = require('../../lib/EntityX');
var Factory = require('../../lib/Factory');
var CoreObject = require('../../lib/entities/CoreObject');
var Entity = require('../../lib/entities/Entity');
var ValueObject = require('../../lib/entities/ValueObject');
var errorCodes = require('../../lib/errorCodes');

describe('Object: getDataForSave', function() {

  beforeEach(function() {
    EntityX._reset();
    EntityX.addModule(path.join(__dirname, '..', 'classesTest'));
  });

  it('Get data for ValueObject field', function() {
    var model = new CoreObject();
    try {
      model._getStructuredValueForSave('field1');
      throw 'should be thown an error';
    } catch (e) {
      e.code.should.be.equal(errorCodes.INTERFACE_NOT_INHERITED);
    }
  });

  it('Get data for string field', function() {
    var model = new Entity({
      'useTimestamp': true,
      repositoryName: 'TestModule/Inherit'
    });
    var stub = sinon.stub(model, '_getData');
    stub.returns('string');

    var result = model._getDataForSave('field1');
    result.should.be.equal('string');
  });

  it('Get data for number field', function() {
    var model = new Entity({
      'useTimestamp': true,
      repositoryName: 'TestModule/Inherit'
    });
    var stub = sinon.stub(model, '_getData');
    stub.returns(10);

    var result = model._getDataForSave('field1');
    result.should.be.equal(10);
  });

  it('Get data for object field', function() {
    var model = new Entity({
      'useTimestamp': true,
      repositoryName: 'TestModule/Inherit'
    });
    var stub = sinon.stub(model, '_getData');
    stub.returns({'name': 'foo'});

    var result = model._getDataForSave('field1');
    result.should.be.eql({'name': 'foo'});
  });

  it('Get data for date field', function() {
    var model = new Entity({
      'useTimestamp': true,
      repositoryName: 'TestModule/Inherit'
    });
    var stub = sinon.stub(model, '_getData');
    var returnDate = new Date();
    stub.returns(returnDate);

    var result = model._getDataForSave('field1');
    result.should.be.eql(returnDate);
  });

  it('Get data for Entity field', function() {
    var model = new Entity({
      'useTimestamp': true,
      repositoryName: 'TestModule/Inherit'
    });

    var stub = sinon.stub(model, '_getData');
    stub.returns(Factory.getEntity('TestModule/EntityInherit', 1));

    var result = model._getDataForSave('field1');
    result.should.be.eql({'_id': 1});
  });

  it('Get data for ValueObject field', function() {
    var model = new Entity({
      'useTimestamp': true,
      repositoryName: 'TestModule/Inherit'
    });

    var stub = sinon.stub(model, '_getData');
    var valueObj = new ValueObject();
    valueObj._setData('name', 'foo');
    valueObj._setData('surname', 'bar');

    stub.returns(valueObj);

    var result = model._getDataForSave('field1');
    result.should.be.eql({'name': 'foo', 'surname': 'bar'});
  });

  it('Get data for ValueObject field', function() {
    var model = new Entity({
      'useTimestamp': true,
      repositoryName: 'TestModule/Inherit'
    });

    var stub = sinon.stub(model, '_getData');
    stub.throws(new ErrorX(404, 'Key [name] not initialized'));

    try {
      model._getDataForSave('field1');
      throw 'should be thown an error';
    } catch (e) {
      e.should.be.eql(new ErrorX(404, 'Key [name] not initialized'));
    }
  });
});
