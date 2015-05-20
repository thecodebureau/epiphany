var path = require('path');

module.exports = function(bind) {
	bind = bind || global;

	bind.ENV = process.env.NODE_ENV || 'development';
	bind.PWD = process.env.PWD;
	bind.DEBUG_ERROR_HANDLER = false;
	bind.DEBUG_RESPONDER = false;
	bind.LOGIN_USER = false;
	//bind.LOGIN_USER = 'username';
	//bind.LOGIN_USER = 'linus.miller@thecodebureau.com';
};
