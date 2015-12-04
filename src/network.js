/**
 * @fileoverview A network object which abstracts away how the request is being made
 * in node or browers.
 * @author Lu Pan
 */

'use strict';

/**
 * @namespace The network object supports basic http request functionalities e.g. GET
 */
var network = {
	_headers: undefined,
    /**
     * Make a GET http request to url.
     * @param {string} url - The target url
     * @returns {Promise} - A promise of the GET result.
     */
	get: function(url) {
		var Promise = require('promise');
		var thisNetwork = this;
		if (typeof window !== 'undefined') {
			var $ = require('jquery');
			return new Promise(function (resolve, reject) {
				$.ajax({
					type: 'GET',
					url: url,
					headers: thisNetwork._headers
				}).done(function (data) {
					resolve(data);
				}).fail(function (err) {
					reject(err);
				});
			});
		} else {
			var request = require('request');
			return new Promise(function (resolve, reject) {
				request.get({
					url: url,
					headers: thisNetwork._headers
				}, function (err, res, body) {
					if (!err && res.statusCode == 200) {
						resolve(JSON.parse(body));
					} else {
						reject(err);
					}
				});
			});
		}
	},
    /**
     * Set the HTTP headers to use for all the subsequent requests
     * @param {Object} headers - HTTP request headers
     */
	setHeaders: function(headers) {
		this._headers = headers;
	}
};

module.exports = network;
