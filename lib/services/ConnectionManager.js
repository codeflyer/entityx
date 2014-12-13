module.exports = function() {
  /**
   * The connections
   * @type {Array.<*>}
   * @private
   */
  var _connections = {};

  /**
   * The name of the default connection
   * @type {string}
   * @private
   */
  var _defaultName = 'DEFAULT_CONNECTION';

  return {
    /**
     * Add a connection
     * @param {string} name
     * @param {*} connection
     */
    addConnection: function(name, connection) {
      if (arguments.length === 1) {
        connection = arguments[arguments.length - 1];
        name = _defaultName;
      }
      _connections[name] = connection;
    },

    /**
     * Get the connection
     * @param {string} name
     * @returns {*}
     */
    getConnection: function(name) {
      if (arguments.length === 1) {
        if (_connections[name] == null) {
          throw new Error('Connection [' + name + '] not initialized');
        }
        return _connections[name];
      }
      if (_connections[_defaultName] == null) {
        throw new Error('Default connection not initialized');
      }
      return _connections[_defaultName];
    },

    /**
     * Get the list of the connections
     * @returns {Array.<string>}
     */
    getConnectionList: function() {
      return Object.keys(_connections);
    },

    /**
     * reset the list of the connections
     */
    reset: function() {
      _connections = [];
    },

    hasConnection: function(name) {
      if (arguments.length === 1) {
        if (_connections[name] == null) {
          return false;
        }
        return true;
      }
      if (_connections[_defaultName] == null) {
        return false;
      }
      return true;
    }
  };
}();
