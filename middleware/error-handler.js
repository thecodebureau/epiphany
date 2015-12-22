// modules > native
var p = require('path');
var fs = require('fs');

// modules > internal
var format = require('../util/format-error');
var log = require('../util/log-error');

var config = require(p.join(PWD, 'server/config/error-handler'));

module.exports = function errorHandler(error, req, res, next) {
	error = format(error, req, { format: false });

	log(error, req);

	// limit what properties are sent to the client by overriding toJSON().
	error.toJSON = function() {
		return _.pick(this, config.mystify.properties);
	};

	res.status(error.status);

	res.data = { error: error };

	next();
};
