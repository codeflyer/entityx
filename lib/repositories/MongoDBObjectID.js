var util = require("util");
var MongoDB = require('./MongoDB');
var ObjectID = require('mongodb').ObjectID;

var MongoDBObjectIDDriver = function(options, id) {
    MongoDB.call(this, options);

    if(id != null && id instanceof ObjectID) {
        this._id = id;
    }
};
util.inherits(MongoDBObjectIDDriver, MongoDB);


MongoDBObjectIDDriver.prototype.insert = function(data, next) {
    var that = this;

    if(that.useTimestamp) {
        var creationDate = new Date();
        data._ts = {
            created : creationDate,
            modified : creationDate,
            deleted : null
        };
    }

    if(this.useObjectId) {
        that.getCollection(that.collectionName).insert(data, function(err, doc) {
            if(err) {
                return next(err);
            }
            return next(null, doc[0]);
        });
    }
};

module.exports = MongoDBObjectIDDriver;