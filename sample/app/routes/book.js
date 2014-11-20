var Factory = require('entityx').Factory;

module.exports = function(req, res) {
  // curl http://localhost:3000/book/546d0e283793275f9b72d026
  //var id = '546d0e283793275f9b72d026';
  var currentBook = Factory.getEntity('Books/Book', req.params.idBook);

  currentBook.load().then(
      function() {
        return currentBook.getAuthor().load();
      }
  ).then(
      function() {
        return currentBook.getArray();
      }
  ).then(
      function(data) {
        res.json(data);
      }
  ).catch(
      function(err) {
        res.json(err);
      }
  );

//currentBook.getTitle().then(
//    function(title) {
//      res.end(title);
//    }
//);
//

//currentBook.load().then(
//  function() {
//    var data = currentBook._data;
//
//    res.json(data);
//  }
//);
}
;