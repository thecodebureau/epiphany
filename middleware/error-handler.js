var p = require('path');
var http = require('http');
var fs = require('fs');

var debug = require('debug')('epiphany:errorHandler');
var chalk = require('chalk');
var _ = require('lodash');

// string added to all errors logged to console
var prefix = '[' + chalk.red('EE') + ']: ';

// get file location from stack trace
var fileLocationPattern = new RegExp(PWD + '\\/([\\/\\w-_\\.]+\\.js):(\\d*):(\\d*)');

function parseFileLocation(stack) {
	if (_.isString(stack))
		return _.zipObject(['fileName', 'lineNumber', 'columnNumber'],
			_.rest(stack.match(fileLocationPattern)));
}

var formatStack = require('../util/format-stack');

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
			if(config.log.console) {
				for(var prop in error) {
					// TODO pretty print stack
					if(prop === 'stack') {
						console.error(prefix + ' STACK:');

						var stack;

						if(ENV === 'development') {
							stack = formatStack(error.stack);
						}
						console.error(stack || error.stack);
					} else {
						console.error(prefix + prop + ': ' + JSON.stringify(error[prop]));
					}
				}
			}

			if(config.log.database) {
				ErrorModel.create(error, function(err) {
					// TODO handle errors in error handler better
					if(err) {
						console.error("ERROR WRITING TO DATABASE");
						console.error(err);
						console.error("ORIGINAL ERROR");
						console.error(error);
					}
				});
			}
		}
	}

	return function (error, req, res, next) {

		error = _.extend({}, error, _.pick(error, [ 'stack', 'message', 'name' ]));

		debug('original error: ' + JSON.stringify(error, null, '\t'));

		if (error.status == 401 && !req.user && !req.xhr && req.accepts('html', 'json') == 'html') {
			req.session.lastPath = req.path;
			return res.redirect('/login');
		}

		error.status = error.status || 500;
		error.statusText = http.STATUS_CODES[error.status];
		error.path = req.path;
		error.method = req.method;
		error.ip = req.ip;
		error.userAgent = req.headers['user-agent'];

		if(error.status >= 500) {
			if(!_.isEmpty(req.body)) error.body = req.body;
			if(!_.isEmpty(req.query)) error.query = req.query;
			
			_.defaults(error, parseFileLocation(error.stack));

			error.xhr = req.xhr;

			if(req.user) error.user = req.user.email;

			if(error.name === 'ValidationError') {
				error.details = {
					validationErrors: _.pluck(error.errors, 'message')
				};
			}
		} else {
			delete error.stack;
		}

		// sort properties by name
		error = _.object(_.sortBy(_.pairs(error), function(pair) { 
			return pair[0];
		}));

		debug('error: ' + JSON.stringify(error, null, '\t'));

		log(error);

		res.status(error.status);

		error.toJSON = mystify;

		res.data = { error: error };

		next();
	};
};