var AggregatePipe = require('./../../../lib/repositories/MongoDbAggregatePipe');

describe('Repositories, MongoDbAggregatePipe', function() {

  it('Add some command',
      function() {
        var pipe = new AggregatePipe();

        pipe
            .project({'name': 1})
            .match({surname: 'black'});

        pipe.getPipe().should.be.eql(
            [
              {$project: {'name': 1}},
              {$match: {surname: 'black'}}
            ]);
      });
});
