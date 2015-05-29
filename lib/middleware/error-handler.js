var http = require('http');
var path = require('path');
var fs = require('fs');

var _ = require('lodash');

// string added to all errors logged to console
var prefix = '[EE]: ';

var debug = typeof DEBUG_ERROR_HANDLER === 'boolean' ? DEBUG_ERROR_HANDLER : false;

module.exports = function (config) {
	config = config.errorHandler ? config.errorHandler : config;

	var ErrorModel;

	if(config.log.database) 
		ErrorModel = require('mongoose').model('Error');

	// only send allowed properties to the client
	Error.prototype.mystify = function() {
		// TODO remove stack and other sensitive stuff for unauthorized suckers
		var properties = config.mystify.properties;
		var obj = {}; 
		for(var i in properties) {
			if(this[properties[i]])
				obj[properties[i]] = this[properties[i]];
		}
		return obj;
	};


	var handle = function (error, req, res, next) {
		console.log(_.keys(error));
		console.log(error);
		function format(error) {
			error.message = error.message || 'No message';
			error.status = error.status || 500;
			error.statusText = http.STATUS_CODES[error.status];
			error.path = req.path;
			error.method = req.method;
			if(error.status >= 500) {
				if(_.keys(req.body) > 0) error.body = req.body;
				if(_.keys(req.query) > 0) error.query = req.body;
				error.ip = req.ip;
				error.xhr = req.xhr;
				if(req.user) error.user = req.user.email;

				if(error.name === 'ValidationError') {
					error.details = {
						validationErrors: _.reduce(error.errors, function(obj, error, key) {
							obj.push(error.message);
							return obj;
						}, [])
					};
				}
			}
			if(error.stack) {
				var regExp = new RegExp(PWD + '\\/([\\/\\w-_\\.]+\\.js):(\\d*):(\\d*)');
				var match = error.stack.match(regExp);
				if(match) {
					error.fileName = error.fileName || match[1];
					error.lineNumber = error.lineNumber || match[2];
					error.columnNumber = error.columnNumber || match[3];
				}
			}
		}

		function log(error) {
			var properties = config.log.properties;

			// this function uses the config to decide what properties of the error to log
			function pluck(error) {
				var props = _.reduce(properties, function(props, val, key) {
					return new RegExp(key).test(error.status.toString()) ? _.union(props, val) : props;
				}, []);

				return _.pick(error, props);
			}
			
			if(config.log.ignore.indexOf(error.status) < 0) {
				var obj = pluck(error);
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

		if (debug) console.log(prefix + 'original error: ' + JSON.stringify(error, null, '\t'));
		
		if(error.status && error.status === 401 && req.path !== '/auth/local' && !req.user) {
			req.session.lastPath = req.path;
			return res.redirect('/login');
		}
		
		format(error);

		if (debug) console.log(prefix + 'error: ' + JSON.stringify(error, null, '\t'));

		log(error);

		res.status(error.status);

		res.format({
			text: function () {
				if (debug) console.error(prefix + 'accepts TEXT, returning TEXT');
				res.send(error.message || error.statusText);
			},
			html: function () {
				if (debug) console.error(prefix + 'accepts HTML, returning HTML');
				res.locals.error = error.mystify();
				res.render(res.master || 'master');
			},
			json: function () {
				if (debug) console.error(prefix + 'accepts JSON, return JSON');

				return res.json(error.mystify());
			}
		});
	};

	return handle;
};
