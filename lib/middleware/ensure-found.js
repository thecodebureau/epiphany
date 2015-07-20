module.exports = function(config) {
	return function ensureFound(req, res, next) {
		// TODO deprecate res.page
		if (res.template || res.page || _.some(res.data)) {
			next();
		} else {
			// generates Not Found error if there is no page to render and no truthy values in data
			var err = new Error('Not found: ' + req.path);
			err.status = 404;
			next(err);
		}
	};
};
