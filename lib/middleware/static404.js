var http = require('http');

module.exports = function(config) {
	return function(req, res, next) {
		if(/\.[\w]+$/.test(req.path)) {
			var err = new Error(http.STATUS_CODES[404]);
			err.status = 404;
			next(err); 
		} else
			next();
	};
};
