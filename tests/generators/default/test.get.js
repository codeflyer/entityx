require('should');
var Promise = require('bluebird');
var generatorGet = require('../../../lib/generators/code/default/get');

describe('Generators code default get', function() {

  it('The model is not load', function(done) {
    var getDataCount = 0;
    var loadCount = 0;

    var TestModel = function() {
      this._isLoad = false;
      this._getData = function(valueName) {
        getDataCount++;
        return 'modified-' + valueName;
      };
      this.load = function() {
        loadCount++;
        return {
          bind: function(obj) {
            return {
              then: function(promiseCallback) {
                var value = promiseCallback.call(obj, null);
                return {
                  'catch': function(errorCallback) {
                    return Promise.resolve(value);
                  }
                };
              }
            };
          }
        };
      };
    };
    TestModel.prototype.getName = generatorGet('name');

    var instance = new TestModel();
    try {
      instance.getName().then(
          function(value) {
            value.should.be.equal('modified-name');
            getDataCount.should.be.equal(1);
            loadCount.should.be.equal(1);
            done();
          }
      );
    } catch (e) {
      done(e);
    }
  });

  it('The model is load', function(done) {
    var getDataCount = 0;
    var loadCount = 0;

    var TestModel = function() {
      this._isLoad = true;
      this._getData = function(valueName) {
        getDataCount++;
        return 'modified-' + valueName;
      };
      this.load = function() {
        loadCount++;
        return {
          bind: function(obj) {
            return {
              then: function(promiseCallback) {
                var value = promiseCallback.call(obj, null);
                return {
                  'catch': function(errorCallback) {
                    return Promise.resolve(value);
                  }
                };
              }
            };
          }
        };
      };
    };
    TestModel.prototype.getName = generatorGet('name');

    var instance = new TestModel();
    try {
      instance.getName().then(
          function(value) {
            value.should.be.equal('modified-name');
            getDataCount.should.be.equal(1);
            loadCount.should.be.equal(0);
            done();
          }
      );
    } catch (e) {
      done(e);
    }
  });

});
