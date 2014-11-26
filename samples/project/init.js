// catch the uncaught errors that weren't wrapped in a domain or try catch statement
// do not use this in modules, but only in applications, as otherwise we could have multiple of these bound
process.on('uncaughtException', function(err) {
    // handle the error safely
    console.log('ERROR');
    console.log(err);
    process.exit(1);
});


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

    EntityX.ConnectionManager.getConnection().dropDatabaseAsync().then(
        function() {
            var address = EntityX.Factory.getValueObject('Books/Address',
                {'street' : 'Orange Road', 'zip' : '40120'}
            );
            var author = EntityX.Factory.getEntity('Books/Author');
            author.setName('Charles');
            author.setSurname('Dickens');
            author.setAddress(address);
            return author.insert();
        }
    ).then(function(newAuthor) {
            var book = EntityX.Factory.getEntity('Books/Book');
            book.setTitle('David Copperfield');
            book.setPages(200);
            book.setAuthor(newAuthor);
            book.setPublisher('Penguin');
            book.setReleaseDate(new Date('1990-10-01'));
            return book.insert();
        }
    ).then(
        function(newBook) {
            console.log(newBook);
            return null;
        }
    );

});

