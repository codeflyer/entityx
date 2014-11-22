require('should');
var generatorGet = require('../../../lib/generators/code/default/getAsync');

describe('Generators code default get', function() {

  it('Call the getDataAsync', function(done) {
    var getDataCount = 0;

    var TestModel = function() {
      this._isLoad = false;
      this._getDataAsync = function(valueName) {
        getDataCount++;
        return 'modified-' + valueName;
      };
    };
    TestModel.prototype.getNameAsync = generatorGet('name');

    var instance = new TestModel();
    try {
      instance.getNameAsync().then(
          function(value) {
            value.should.be.equal('modified-name');
            getDataCount.should.be.equal(1);
            done();
          }
      );
    } catch (e) {
      done(e);
    }
  });
});
