var path = require('path');
var Promise = require('bluebird');
var EntityX = require('../../lib/EntityX');
var Factory = require('../../lib/Factory');
var errorCodes = require('../../lib/errorCodes');

describe('Object: insert', function() {

  beforeEach(function() {
    EntityX._reset();
    EntityX.addModule(path.join(__dirname, '..', 'classesTest'));
  });

  it('Try to insert an existent object', function(done) {
    var model = Factory.getEntity('TestModule/EntityInherit', 1);
    model.insert().then(function() {
      done('should be thrown');
    }).catch(function(err) {
      err.code.should.be.equal(errorCodes.ENTITY_ALREADY_EXISTS);
      done();
    });
  });

  it('Insert an object', function(done) {
    var model = Factory.getEntity('TestModule/EntityInherit');
    (model.getId() == null).should.be.true;
    model.isNewObject().should.be.true;

    model._getRepository = function() {
      return {
        insert: function(values) {
          values.should.be.eql({'name' : 'davide'});
          return Promise.resolve({'_id': 20});
        }
      };
    };
    model.setName('davide');
    model.insert().then(function() {
      model.getId().should.be.equal(20);
      model.isNewObject().should.be.false;
      done();
    }).catch(function(err) {
      done(err);
    });
  });

  it('Insert an object with error', function(done) {
    var model = Factory.getEntity('TestModule/EntityInherit');
    (model.getId() == null).should.be.true;
    model.isNewObject().should.be.true;

    model._getRepository = function() {
      return {
        insert: function(values) {
          values.should.be.eql({'name' : 'davide'});
          return Promise.reject(new Error('error'));
        }
      };
    };
    model.setName('davide');
    model.insert().then(function() {
      done('should be thrown');
    }).catch(function(err) {
      err.code.should.be.equal(errorCodes.REPOSITORY_OPERATION_ERROR);
      err.parentError.message.should.be.equal('error');
      done();
    });
  });
});
