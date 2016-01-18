var dust = require('dustjs-linkedin');

module.exports = function(page, navigation, subnavigation) {
	return Object.defineProperty(function(req, res, next) {
		res.locals.page = _.defaults({
			routePath: page.path,
			path: req.path
		}, page);

		if(req.xhr) {
			res.locals.compiled = _.map(page.templates, dust.compiled.bind(dust));
		} else {
			res.locals.user = req.user;
			res.locals.navigation = navigation;
		}

		next();
	}, 'name', { value: 'page' });
};
