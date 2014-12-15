var Entity = require('./../../lib/entities/Entity');

describe('Entity: various method', function() {

  it('isNewObject == true', function() {
    var entity = null;
    (function() {
      entity = new Entity({});
    }).should.not.throw();

    entity.isNewObject().should.be.true;
  });

  it('isNewObject == false', function() {
    var entity = null;
    (function() {
      entity = new Entity({});
      entity._isNewObject = false;
    }).should.not.throw();

    entity.isNewObject().should.be.false;
  });
});
