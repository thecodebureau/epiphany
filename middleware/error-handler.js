var p = require('path');
var fs = require('fs');

// get file location from stack trace
var format = require('../util/format-error');
var log = require('../util/log-error');

module.exports = function (config) {
	config = config.errorHandler ? config.errorHandler : config;

	return function (error, req, res, next) {

		error = format(error, req, { format: false });

		if (error.status == 401 && !req.user && !req.xhr && req.accepts('html', 'json') == 'html') {
			req.session.lastPath = req.path;
			return res.redirect('/login');
		}


		log(error, req);

		res.status(error.status);

		error.toJSON = function() {
			var properties = config.mystify.properties;
			return _.pick(this, properties);
		};

		res.data = { error: error };

		next();
	};
};
