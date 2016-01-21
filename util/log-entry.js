// modules > native
var p = require('path');

// modules > 3rd party
var chalk = require('chalk');

// string added to all errors logged to console
var prefix = '[' + chalk.blue('LL') + ']: ';

var _config = require(p.join(PWD, 'server/config/logger'));

var logError = require('./log-error');

var LogEntry = require('../models/log-entry');

module.exports = function logEntry(message, req, config) {
	config = _.defaults(config || {}, _config);

	var date = new Date();

	if(config.console) {
		console.log('[' + chalk.cyan(date) + '] ' + message);
	}

	if(config.database) {
		LogEntry.create({
			dateCreated: date,
			message: message,
			user: req && req.user && req.user.id
		}, function(err) {
			// TODO handle errors in error handler better
			if(err) {
				logError(err);
			}
		});
	}
};
