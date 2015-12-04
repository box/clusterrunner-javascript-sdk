describe('ClusterRunner SDK', function() {
	var client= new ClusterRunner('http://localhost:43000');
	it('can get console output of all atoms', function() {
		var arrOfConsoleOutputsPromise = client.getBuild(1).then(function(build) {
			return build.subjobs();
		}).then(function(subjobs) {
			return Promise.all(subjobs.map(function(subjob) {
				return subjob.atoms();
			}));
		}).then(function(arrOfAtoms) {
			var flatAtoms = arrOfAtoms.reduce(function(prev, cur) {
				return prev.concat(cur);
			}, []);
			return Promise.all(flatAtoms.map(function(atom) {return atom.consoleOutput();}));
		});
		arrOfConsoleOutputsPromise.then(function(arrOfConsoleOutputs) {
			assert.equal(arrOfConsoleOutputs.length, 10);
		});
		assert.isFulfilled(arrOfConsoleOutputsPromise);
	});
});