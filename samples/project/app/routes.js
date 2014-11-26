/**
 * @author Davide Fiorello <davide@codeflyer.com>
 */

var indexCtrl = require('./routes/index');
var bookCtrl = require('./routes/book');
var authorCtrl = require('./routes/author');

module.exports = function(app) {
  app.get('/', indexCtrl);
  app.get('/book/:idBook', bookCtrl);
  app.get('/author/:idAuthor', authorCtrl);
};
