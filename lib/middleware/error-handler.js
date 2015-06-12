var http = require('http');
var path = require('path');
var fs = require('fs');

var _ = require('lodash');

// string added to all errors logged to console
var prefix = '[EE]: ';

var debug = typeof DEBUG_ERROR_HANDLER === 'boolean' ? DEBUG_ERROR_HANDLER : false;

// get file location from stack trace
var fileLocationPattern = new RegExp(PWD + '\\/([\\/\\w-_\\.]+\\.js):(\\d*):(\\d*)');

function parseFileLocation(stack) {
	if (_.isString(stack))
		return _.zipObject(['fileName', 'lineNumber', 'columnNumber'],
			_.rest(stack.match(fileLocationPattern)));
}

module.exports = function (config) {
	config = config.errorHandler ? config.errorHandler : config;

	var ErrorModel;

	if(config.log.database) 
		ErrorModel = require('mongoose').model('Error');

	// only send allowed properties to the client
	function mystify() {
		var properties = config.mystify.properties;
		return _.pick(this, properties);
	}

	function log(error) {
		if(config.log.ignore.indexOf(error.status) < 0) {
			// decide what properties of the error to log
			var properties = _.flatten(_.filter(config.log.properties, function(val, key) {
				return new RegExp(key).test(error.status.toString());
			}));
			var obj = _.pick(error, properties);
			if(config.log.console) {
				for(var p in obj) {
					console.error(prefix + p + ': ' + JSON.stringify(obj[p]));
				}
			}

			if(config.log.database) {
				ErrorModel.create(obj, function(err) {
					// TODO handle errors in error handler better
					if(err) console.error(err);
				});
			}
		}
	}

	return function (error, req, res, next) {

		if (debug) console.log(prefix + 'original error: ' + JSON.stringify(error, null, '\t'));

		if (error.status == 401 && !req.user && !req.xhr && req.accepts('html', 'json') == 'html') {
			req.session.lastPath = req.path;
			return res.redirect('/login');
		}

		error.status = error.status || 500;
		error.statusText = http.STATUS_CODES[error.status];
		_.defaults(error, { message: error.statusText }, parseFileLocation(error.stack));
		error.path = req.path;
		error.method = req.method;
		if(error.status >= 500) {
			if(!_.isEmpty(req.body)) error.body = req.body;
			if(!_.isEmpty(req.query)) error.query = req.query;
			error.ip = req.ip;
			error.xhr = req.xhr;
			if(req.user) error.user = req.user.email;

			if(error.name === 'ValidationError') {
				error.details = {
					validationErrors: _.pluck(error.errors, 'message')
				};
			}
		}

		if (debug) console.log(prefix + 'error: ' + JSON.stringify(error, null, '\t'));

		log(error);

		res.status(error.status);

		error.toJSON = mystify;
		next(error);
	};
};
