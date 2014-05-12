require('should');
var EntityInherit = require('./../classesTest/lib/entities/EntityInherit');
var EntityInheritChild = require('./../classesTest/lib/entities/EntityInheritChild');
var EntityInheritSibling = require('./../classesTest/lib/entities/EntityInheritSibling');


describe("Entity: equal", function() {

    it("Object null", function() {
        var entityInherit = new EntityInherit();
        entityInherit._init(1);
        entityInherit.equal(null).should.be.false;
    });

    it("Object not valid", function() {
        var entityInherit = new EntityInherit();
        entityInherit._init(1);
        entityInherit.equal(100).should.be.false;
    });

    it("Same entity same id", function() {
        var entityInherit = new EntityInherit();
        entityInherit._init(1);
        var entityEqual = new EntityInherit();
        entityEqual._init(1);

        entityInherit.equal(entityEqual).should.be.true;
    });

    it("Same entity different id", function() {
        var entityInherit = new EntityInherit();
        entityInherit._init(1);
        var entityEqual = new EntityInherit();
        entityEqual._init(2);

        entityInherit.equal(entityEqual).should.be.false;
    });

    it("Different entity same id", function() {
        var entityInherit = new EntityInherit();
        entityInherit._init(1);
        var entityInheritSibling = new EntityInheritSibling();
        entityInheritSibling._init(1);

        entityInherit.equal(entityInheritSibling).should.be.false;
    });

    it("Different entity same id (a child of b)", function() {
        var entityInherit = new EntityInherit();
        entityInherit._init(1);
        var entityInheritChild = new EntityInheritChild();
        entityInheritChild._init(1);

        entityInherit.equal(entityInheritChild).should.be.false;
    });

});