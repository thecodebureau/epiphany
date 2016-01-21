// modules > native
var http = require('http');

// modules > 3rd party
var debug = require('debug')('epiphany:errorHandler');

var fileLocationPattern = new RegExp(PWD + '\\/([\\/\\w-_\\.]+\\.js):(\\d*):(\\d*)');

function parseFileLocation(stack) {
	if (_.isString(stack))
		return _.zipObject(['fileName', 'lineNumber', 'columnNumber'],
			_.tail(stack.match(fileLocationPattern)));
}

module.exports = function(error, req) {
	error = _.extend({}, error, _.pick(error, [ 'stack', 'message', 'name' ]));

	debug('original error: ' + JSON.stringify(error, null, '\t'));

	error.status = error.status || 500;
	error.statusText = http.STATUS_CODES[error.status];
	error.path = req.path;
	error.method = req.method;
	error.ip = req.ip;
	error.user = req.user && req.user.id;
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

	debug('formatted error: ' + JSON.stringify(error, null, '\t'));

	return error;
};
