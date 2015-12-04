describe('ClusterRunner Build', function() {
	var network = require('../../src/network.js');
	var Build = require('../../src/build.js');
	var Subjob = require('../../src/subjob.js');

	after(function() {
		network.get.restore();
	});

	it('makes a GET call to the correct url and returns a promise of array of subjob objects', function() {
		// Arrange
		sinon.stub(network, 'get', function() {
			return new Promise(function(resolve) {
				resolve({
					subjobs:[
						{
							id: 0,
							atoms: []
						}
					]
				});
			});
		});

		// Act
		var build = new Build(
			'some_master_url',
			'v1',
			{build: {id: 1}}
		);
		var subjobsPromise = build.subjobs();

		// Assert
		chai.assert(network.get.calledOnce);
		chai.assert.equal('some_master_url/v1/build/1/subjob', network.get.getCall(0).args[0]);
		subjobsPromise.should.eventually.deep.equal([new Subjob(
			'some_master_url',
			'v1',
			1,
			{
				id: 0,
				atoms: []
			}
		)]);
	});
});