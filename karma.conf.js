module.exports = function(config) {
	config.set({
		frameworks: ['mocha', 'chai-as-promised', 'chai'],
		browsers: ['Firefox'],
    reporters: ['dots'],

		files: [
			'dist/bundle.js',
			'test/functional/browser/test_get_all_console_output_in_browser.js'
		],

		plugins: [
			'karma-mocha',
			'karma-chai',
			'karma-chai-as-promised',
			'karma-firefox-launcher'
		]
	});
};
