var util = require("util");

module.exports = function() {
    var _connections = {};
    var _defaultName = '_defaultConnection';
    return {
        /**
         * Add a connection
         * @param name
         * @param connection
         */
        addConnection : function(name, connection) {
            if(arguments.length === 1) {
                connection = arguments[arguments.length - 1];
                name = _defaultName;
            }
            _connections[name] = connection;
        },

        /**
         * Get the connection
         * @param name
         */
        getConnection : function(name) {
            if(arguments.length === 1) {
                if(_connections[name] == null) {
                    throw "Connection [" + name + "] not initialized";
                }
                return _connections[name];
            }
            if(_connections[_defaultName] == null) {
                throw "Deafult connection not initialized";
            }
            return _connections[_defaultName];
        }
    }
}();