module.exports = function(Model, perPage) {
	perPage = perPage || 20;
	return function(req, res, next) {
		res.locals.query = req.url.slice(req.url.indexOf('?')).slice(1);
		res.locals.perPage = Math.max(0, req.query.limit) || perPage;

		Model.count(_.omit(req.query, 'limit', 'sort', 'page'), function(err, count) {
			res.data.totalCount = count;
			next(err);
		});
	};
};
