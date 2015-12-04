describe('Network', function() {
	var document = require('jsdom').jsdom();
	window = document.defaultView;
	var $ = require('jquery');

	var network = require('../../src/network.js');

	after(function() {
		$.ajax.restore();
	});

	it('makes jQuery GET call when calling `get` method', function() {
		var fakeUrl = 'some.url.example.com/test';

		var fakeDeferred = $.Deferred();
		sinon.stub($, 'ajax', function() {
			return fakeDeferred;
		});
		fakeDeferred.resolve({key: 'value'});

		var promise = network.get(fakeUrl);
		return promise.should.eventually.deep.equal({key: 'value'});
	});
});