var path = require('path');

module.exports = function(bind) {
	bind = bind || global;

	bind.DEBUG_ERROR_HANDLER = false;
	bind.DEBUG_RESPONDER = false;
	bind.LOGIN_USER = false;
	//bind.LOGIN_USER = 'username';
	//bind.LOGIN_USER = 'linus.miller@thecodebureau.com';
};
