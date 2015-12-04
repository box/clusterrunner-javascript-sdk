/**
 * @fileoverview This is the entry point of the SDK. It defines the ClusterRunner class.
 * @author Lu Pan
 */

'use strict';

/**
 * @param {string} masterUrl - Clusterrunner master url
 * @param {string} sessionId - Clusterrunner master session id
 * @param {string} apiVersion - Clusterrunner API version
 * @constructor
 */
var ClusterRunner = function(masterUrl, sessionId, apiVersion) {
	this._masterUrl = masterUrl;
	this._sessionId = sessionId;
	this._apiVersion = apiVersion ? apiVersion : 'v1';
};

/**
 * Get a promise that resolves to a ClusterRunner build object
 * @param {int} buildId - the id of the build
 * @returns {Promise} a promise which resolves to a ClusterRunner build object
 */
ClusterRunner.prototype.getBuild = function(buildId) {
	var Promise = require('promise');
	var urljoin = require('url-join');

	var Build = require('./build.js');
	var thisClient = this;
	var network = require('./network.js');
	network.setHeaders(this._sessionId ? {'Session-Id': this._sessionId} : undefined);

	var buildJsonPromise = network.get(urljoin(
		this._masterUrl,
		this._apiVersion,
		'build',
		buildId
	));

	return new Promise(function(resolve, reject) {
		buildJsonPromise.then(function(buildJson) {
			var build = new Build(thisClient._masterUrl, thisClient._apiVersion, buildJson);
			resolve(build);
		}, function(err) {
			reject(err);
		});
	});
};

module.exports = ClusterRunner;
