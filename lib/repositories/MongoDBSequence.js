var util = require("util");
var MongoDB = require('./MongoDB');

var MongoDBSequenceDriver = function(options, id) {
    MongoDB.call(this, options);

    if(id > 0) {
        this._id = id;
    }
};
util.inherits(MongoDBSequenceDriver, MongoDB);


/**
 * Reset a sequence on MongoDb
 * @param {string} collectionName
 * @param {number} [value=0]
 * @param next
 * @returns {*}
 */
MongoDBSequenceDriver.prototype.resetSequence = function(collectionName, value, next) {
    if(arguments.length === 2) {
        next = arguments[arguments.length - 1];
        value = 0;
    }
    if(collectionName == null) {
        return next('Collection not defined');
    }
    if(value == null) {
        value = 0;
    }
    this.getCollection('sequences').save(
        { _id : collectionName, seq : value },
        function(err) {
            if(err) {
                next(err);
            } else {
                next(null, true);
            }
        });
};

/**
 * Get a new ID for the insert
 * @param next
 */
MongoDBSequenceDriver.prototype.getNewId = function(next) {
    this.getCollection('sequences').findAndModify(
        { _id : this.collectionName },
        [],
        { $inc : { seq : 1 } },
        {new : true},
        function(err, doc) {
            if(err) {
                next(err);
            } else {
                next(null, doc.seq);
            }
        });
};

MongoDBSequenceDriver.prototype.insert = function(data, next) {
    var that = this;

    if(that.useTimestamp) {
        var creationDate = new Date();
        data._ts = {
            created : creationDate,
            modified : creationDate,
            deleted : null
        };
    }

    this.getNewId(function(err, newId) {
            if(err) {
                return next(err);
            }
            data._id = newId;
            that.getCollection(that.collectionName).insert(data, function(err, doc) {
                if(err) {
                    return next(err);
                }
                return next(null, doc[0]);
            });
        }
    );

};


module.exports = MongoDBSequenceDriver;