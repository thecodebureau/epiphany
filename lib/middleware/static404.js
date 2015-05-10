module.exports = function(config) {
	return function(req, res, next) {
		if(/\.[\w]+$/.test(req.path)) {
			var err = new Error('Not found: ' + req.path);
			err.status = 404;
			next(err); 
		} else
			next();
	};
};
