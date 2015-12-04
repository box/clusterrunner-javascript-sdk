describe('ClusterRunner SDK', function() {
	var Promise = require('promise');
	var chai = require('chai');
	var chaiAsPromised = require('chai-as-promised');
	chai.use(chaiAsPromised);
	chai.should();

	var ClusterRunner = require('../../../src/client.js');
	var client = new ClusterRunner('http://localhost:43000');
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
			chai.assert.equal(arrOfConsoleOutputs.length, 10);
		});
		chai.assert.isFulfilled(arrOfConsoleOutputsPromise);
	});
});