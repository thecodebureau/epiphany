module.exports = function(mw, config) {
	return [
		[ 'get', '/*', mw.templates ]
	];
};
