/**
 * @fileoverview Defines Atom class
 * @author Lu Pan
 */

'use strict';

/**
 * @param {string} masterUrl - Clusterrunner master url
 * @param {string} apiVersion - Clusterrunner API version
 * @param {int} buildId - the build id of which this atom belongs
 * @param {int} subjobId - the subjob id of which this atom belongs
 * @param {Object} atomJson - object representing the atom api response
 * @constructor
 */
var Atom = function(masterUrl, apiVersion, buildId, subjobId, atomJson) {
	this._masterUrl = masterUrl;
	this._apiVersion = apiVersion;
	this._buildId = buildId;
	this._subjobId = subjobId;
	this._atomJson = atomJson;
};

/**
 * Get a promise that resolves to an object representing the console output of an Atom
 * @param {int} offsetLine - offset of the console output
 * @param {int} maxLines - max number of lines want to get for the console output
 * @returns {Promise} a promise that resolves to an object representing the console output of an Atom
 */
Atom.prototype.consoleOutput = function(offsetLine, maxLines) {
	var Promise = require('promise');
	var urljoin = require('url-join');

	var network = require('./network.js');
	var thisAtom = this;

	if (typeof maxLines === 'undefined') {
		maxLines = 50;
	}

	return new Promise(function(resolve, reject) {
		var url = urljoin(
			thisAtom._masterUrl,
			thisAtom._apiVersion,
			'build',
			thisAtom._buildId,
			'subjob',
			thisAtom._subjobId,
			'atom',
			thisAtom._atomJson.id,
				'console?max_lines='+maxLines.toString()
		);
		if (typeof offsetLine === 'number') {
			url = urljoin(url, '&offset_line=' + offsetLine.toString());
		}
		var consoleOutputPromise = network.get(url);
		consoleOutputPromise.then(function(consoleOutputJson) {
			resolve(consoleOutputJson);
		}, function(err) {
			reject(err);
		});
	});
};

/**
 * Get the json object representing the atom
 * @returns {Object|*|Atom._atomJson} the json representation of the atom
 */
Atom.prototype.json = function() {
	return this._atomJson;
};

module.exports = Atom;