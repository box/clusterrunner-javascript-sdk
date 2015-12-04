describe('ClusterRunner Atom.consoleOutput', function() {
	var network = require('../../src/network.js');
	var Atom = require('../../src/atom.js');

	after(function() {
		network.get.restore();
	});

	it('makes GET call to the correct URL and returns a promise of console output', function() {
		// Arrange
		var fakeConsoleOutput = {
			num_lines: 1,
			offset_line: 0,
			content: 'some content',
			total_num_lines: 1
		};
		sinon.stub(network, 'get', function() {
			return new Promise(function(resolve) {
				resolve(fakeConsoleOutput);
			});
		});

		// Act
		var atom = new Atom(
			'some_master_url',
			'v1',
			1,
			2,
			{id: 0}
		);
		var consoleOutputPromise = atom.consoleOutput();

		// Assert
		chai.assert(network.get.calledOnce);
		chai.assert.equal(
			'some_master_url/v1/build/1/subjob/2/atom/0/console?max_lines=50',
			network.get.getCall(0).args[0]
		);
		consoleOutputPromise.should.eventually.deep.equal(fakeConsoleOutput);
	});
});