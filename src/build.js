/**
 * @fileoverview Defines Build class
 * @author Lu Pan
 */

'use strict';

/**
 * @param {string} masterUrl - Clusterrunner master url
 * @param {string} apiVersion - Clusterrunner API version
 * @param {Object} buildJson - object representing the build api response
 * @constructor
 */
var Build = function(masterUrl, apiVersion, buildJson) {
	this._masterUrl = masterUrl;
	this._apiVersion = apiVersion;
	this._buildJson = buildJson;
};

/**
 * Get a promise that resolves to an array of subjobs
 * @returns {Promise} a promise that resolves to an array of subjobs
 */
Build.prototype.subjobs = function() {
	var Promise = require('promise');
	var urljoin = require('url-join');

	var network = require('./network.js');
	var Subjob = require('./subjob.js');
	var thisBuild = this;

	return new Promise(function(resolve, reject) {
		var subjobsJsonPromise = network.get(urljoin(
			thisBuild._masterUrl,
			thisBuild._apiVersion,
			'build',
			thisBuild._buildJson.build.id,
			'subjob'
		));
		subjobsJsonPromise.then(function(subjobJson) {
			var subjobArr = subjobJson.subjobs.map(function(aSubjobJson) {
				return new Subjob(
					thisBuild._masterUrl,
					thisBuild._apiVersion,
					thisBuild._buildJson.build.id,
					aSubjobJson
				);
			});
			resolve(subjobArr);
		}, function(err) {
			reject(err);
		});
	});
};

/**
 * Get object representing the json api response of the build
 * @returns {Object|*|Build._buildJson} the json representation of the build object
 */
Build.prototype.json = function() {
	return this._buildJson;
};

module.exports = Build;
