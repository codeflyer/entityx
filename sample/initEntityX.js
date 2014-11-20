/**
 *
 * Module for the management of the MongoDb Connection.
 * Create the connection with mongodb and store it in the registry.
 * Expose a middleware method that chech the connection and send an error message if the connection isn't intitialized yet.
 *
 * @module MongoDbStarter
 *
 * @author Davide Fiorello <davide@codeflyer.com>
 * @copyright Copyright © 2014, ESIS S.r.l.
 */
var Promise = require('bluebird');
Promise.promisifyAll(require('mongodb'));
var MongoClient = require('mongodb').MongoClient;
var EntityX = require('entityx');

EntityX.setApplicationRoot(__dirname);
EntityX.addModule('modules/books');

MongoClient.connect('mongodb://127.0.0.1:27017/BookLibrary', function(err, db) {
  console.log("Check for MongoConnection");
  console.log(new Date());
  console.log('mongodb://127.0.0.1:27017/BookLibrary');
  if(err) {
    console.err("Mongo connection error");
    console.err(err);
    return;
  }
  
  EntityX.ConnectionManager.addConnection(db);
});

module.exports = {};