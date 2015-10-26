var colorizeStack = require('./colorize-stack');
var formatError = require('./format-error');

var chalk = require('chalk');
var debug = require('debug')('epiphany:errorHandler');

// string added to all errors logged to console
var prefix = '[' + chalk.red('EE') + ']: ';

var _config;

function logError(error, req, config) {
	config = _.defaults(config || {}, _config);

	if(config.format !== false)
		error = formatError(error, req);

	var ErrorModel;

	if(config.database) 
		ErrorModel = require('mongoose').model('Error');

	if(config.ignore.indexOf(error.status) < 0) {
		if(config.console) {
			for(var prop in error) {
				// TODO pretty print stack
				if(prop === 'stack') {
					console.error(prefix + ' STACK:');

					console.error(colorizeStack(error.stack));
				} else {
					console.error(prefix + prop + ': ' + JSON.stringify(error[prop]));
				}
			}
		}

		if(config.database) {
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

logError.setConfig = function(config) {
	_config = config;
};

module.exports = logError;
