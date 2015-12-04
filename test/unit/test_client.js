describe('ClusterRunner client', function() {
	var network = require('../../src/network.js');
	var ClusterRunner = require('../../src/client.js');
	var Build = require('../../src/build.js');

	var fakeMaster = 'some_master';
	var crClient = new ClusterRunner(fakeMaster);

	// Prepate test data for resolved promise
	var fakeBuildJson = {build: {id: 1}};
	var fakeResolvedBuildPromise = new Promise(function(resolve) {
		resolve(fakeBuildJson);
	});
	var fakeBuild = new Build(fakeMaster, 'v1', fakeBuildJson);

	// Prepare test data for rejected promise
	var expectedError = 'some error';
	var fakeRejectedBuildPromise = new Promise(function(resolve, reject) {
		reject(expectedError);
	});

	withData({
		'resolved build promise': [fakeResolvedBuildPromise, true, fakeBuild],
		'rejected build promise': [fakeRejectedBuildPromise, false, expectedError]
	}, function(promise, resolved, expectedResult) {
		it('returns correct promise when getBuild is called', function() {
			// Arrange
			sinon.stub(network, 'get', function() {
				return promise;
			});

			// Act
			var buildPromise = crClient.getBuild(1);

			// Assert
			network.get.restore();
			if (resolved) {
				return buildPromise.should.eventually.deep.equal(expectedResult);
			} else {
				return buildPromise.should.be.rejectedWith(expectedResult);
			}
		});
	});

	it('makes GET call to the correct URL when getBuild is called', function() {
		// Arrange
		sinon.stub(network, 'get', function() {
			return fakeBuild;
		});
		var fakeBuildNo = 1;

		// Act
		crClient.getBuild(fakeBuildNo);

		// Assert
		chai.assert(network.get.calledOnce);
		chai.assert.equal(fakeMaster + '/v1/build/' + fakeBuildNo.toString(), network.get.getCall(0).args[0]);
		network.get.restore();
	});

	it('sets global network headers when getBuild is called', function() {
		// Arrange
		sinon.spy(network, 'setHeaders');
		sinon.stub(network, 'get', function() {
			return fakeBuild;
		});

		// Act
		crClient.getBuild(1);

		// Assert
		network.get.restore();
		chai.assert(network.setHeaders.calledOnce);
		network.setHeaders.restore();
	});
});
