describe('ClusterRunner Subjob.atoms', function() {
	var network = require('../../src/network.js');
	var Subjob = require('../../src/subjob.js');
	var Atom = require('../../src/atom.js');

	after(function() {
		network.get.restore();
	});

	it('makes GET call to the correct URL and returns a promise of an array of Atoms', function() {
		// Arrange
		sinon.stub(network, 'get', function() {
			return new Promise(function(resolve) {
				resolve({
					atoms: [{id: 0}]
				});
			});
		});
		// Act
		var subjob = new Subjob(
			'some_master_url',
			'v1',
			1,
			{id: 1}
		);
		var atomsPromise = subjob.atoms();

		// Assert
		chai.assert(network.get.calledOnce);
		chai.assert.equal(
			'some_master_url/v1/build/1/subjob/1/atom',
			network.get.getCall(0).args[0]
		);
		atomsPromise.should.eventually.deep.equal([new Atom(
			'some_master_url',
			'v1',
			1,
			1,
			{id: 0}
		)]);
	});
});