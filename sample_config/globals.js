var path = require('path');

module.exports = function(bind) {
	bind = bind || global;

	process.env.PWD = process.env.PWD || path.dirname(__dirname);

	bind.ENV = process.env.NODE_ENV || 'development';
	bind.DEBUG_ERROR_HANDLER = false;
	bind.DEBUG_RESPONDER = false;
	bind.PWD = process.env.PWD;
	bind.LOGIN_USER = false;
	//bind.LOGIN_USER = 'username';
	//bind.LOGIN_USER = 'linus.miller@thecodebureau.com';
};
