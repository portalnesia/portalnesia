module.exports = function getLicenseBanner() {
	const date = new Date();

	// License banner starts with `!`. That combines with uglifyjs' `comments` /^!/ option
	// make webpack preserve that banner while cleaning code from others comments during the build task.
	// It's because UglifyJsWebpackPlugin minification takes place after adding a banner.

	/* eslint-disable indent */
	return (
`/*!
 * @license Copyright (c) ${ date.getFullYear() }, Portalnesia - Putu Aditya. All rights reserved.
 */`
	);
	/* eslint-enable indent */
};