/**
 * @fileoverview Defines Subjob class
 * @author Lu Pan
 */

'use strict';

/**
 * @param {string} masterUrl - Clusterrunner master url
 * @param {string} apiVersion - Clusterrunner API version
 * @param {int} buildId - build id of which the subjob belongs
 * @param {Object} subjobJson - object representing the api json response of the subjob
 * @constructor
 */
var Subjob = function(masterUrl, apiVersion, buildId, subjobJson) {
	this._masterUrl = masterUrl;
	this._apiVersion = apiVersion;
	this._buildId = buildId;
	this._subjobJson = subjobJson;
};

/**
 * Get the object representing the api json response of the subjob
 * @returns {Object|*|Subjob._subjobJson} the json representation of the subjob object
 */
Subjob.prototype.json = function() {
	return this._subjobJson;
};

/**
 * Get a promise that resolves to an array of atoms
 * @returns {Promise} a promise that resolves to an array of atoms
 */
Subjob.prototype.atoms = function() {
	var Promise = require('promise');
	var urljoin = require('url-join');

	var network = require('./network.js');
	var Atom = require('./atom.js');
	var thisSubjob = this;

	return new Promise(function(resolve, reject) {
		var atomsJsonPromise = network.get(urljoin(
			thisSubjob._masterUrl,
			thisSubjob._apiVersion,
			'build',
			thisSubjob._buildId,
			'subjob',
			thisSubjob._subjobJson.id,
			'atom'
		));
		atomsJsonPromise.then(function(atomsJson) {
			var atomsArr = atomsJson.atoms.map(function(anAtomJson) {
				return new Atom(
					thisSubjob._masterUrl,
					thisSubjob._apiVersion,
					thisSubjob._buildId,
					thisSubjob._subjobJson.id,
					anAtomJson
				);
			});
			resolve(atomsArr);
		}, function(err) {
			reject(err);
		});
	});
};

module.exports = Subjob;
