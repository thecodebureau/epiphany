module.exports = function(config) {
	return function ensureFound(req, res, next) {
		if (res.locals.template || res.master || _.some(res.data)) {
			next();
		} else {
			// generates Not Found error if there is no page to render and no truthy values in data
			console.log("\n\n\n\nNOT FOUND");
			var err = new Error('Not found: ' + req.path);
			err.status = 404;
			next(err);
		}
	};
};
