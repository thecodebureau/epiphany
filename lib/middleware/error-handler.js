var chalk = require(PWD + '/node_modules/chalk');
var http = require('http');
var path = require('path');
var fs = require('fs');

var _ = require('lodash');

// string added to all errors logged to console
var prefix = '[' + chalk.red('EE') + ']: ';

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
			if(config.log.console) {
				for(var p in error) {
					// TODO pretty print stack
					if(p === 'stack') {
						console.log(prefix + ' STACK:');

						var stack;

						if(ENV === 'development') {
							var regExp = new RegExp(PWD + '/(?!node_modules/)([^:]+)', 'g');

							stack = error.stack.replace(regExp, function(match, group1) {
								return match.replace(group1, chalk.yellow(group1));
							});
						}
						console.error(stack || error.stack);
					} else {
						console.error(prefix + p + ': ' + JSON.stringify(error[p]));
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

		if (debug) console.log(prefix + 'original error: ' + JSON.stringify(error, null, '\t'));

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

		if (debug) console.log(prefix + 'error: ' + JSON.stringify(error, null, '\t'));

		log(error);

		res.status(error.status);

		error.toJSON = mystify;

		res.data = { error: error };

		next();
	};
};
