var Factory = require('entityx').Factory;

module.exports = function(req, res) {
  // curl http://localhost:3000/author/546d12ba3793275f9b72d027
  //var id = '546d12ba3793275f9b72d027';
  var currentAuthor = Factory.getEntity('Books/Author', req.params.idAuthor);


  currentAuthor.getArray().then(
      function(data) {
        res.json(data);
      }
  ).catch(function(err) {
        res.json(err);
      });
};