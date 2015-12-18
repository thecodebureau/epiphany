module.exports = function(page, navigation, subnavigation) {
	return Object.defineProperty(function(req, res, next) {

		var pageClone = _.clone(page);
		pageClone.routePath = pageClone.path;
		pageClone.path = req.path;
		res.locals.page = pageClone;

		res.locals.navigation = navigation;

		res.locals.template = pageClone.template;

		next();
	}, 'name', { value: 'page' });
};
