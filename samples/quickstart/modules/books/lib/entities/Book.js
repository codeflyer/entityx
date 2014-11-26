var util = require('util');
var Entity = require('entityx').Entity;

var Book = function() {
  Entity.call(this,
      {'useTimestamp': true, repositoryName: 'Books/Book'});
};
util.inherits(Book, Entity);

Book.prototype._loadDetails = function(details) {
  this._setData('title', details.title);
  this._setData('author', details.author);
  this._setData('publisher', details.publisher);
  this._setData('releaseDate', details.releaseDate);
};

Book.prototype.setTitle = function(title) {
  return this._setData('title', title);
};

Book.prototype.getTitle = function() {
  return this._getData('title');
};

Book.prototype.setAuthor = function(author) {
  return this._setData('author', author);
};

Book.prototype.getAuthor = function() {
  return this._getData('author');
};

Book.prototype.setPublisher = function(publisher) {
  return this._setData('publisher', publisher);
};

Book.prototype.getPublisher = function() {
  return this._getData('publisher');
};

Book.prototype.setReleaseDate = function(releaseDate) {
  return this._setData('releaseDate', releaseDate);
};

Book.prototype.getReleaseDate = function() {
  return this._getData('releaseDate');
};

module.exports = Book;


//var defineBookStruct = require('../structs/book.json');
//var Builder = require('entityx').Builder;
//var Book = Builder.buildEntity(defineBookStruct);
//module.exports = Book;
