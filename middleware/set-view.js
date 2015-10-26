module.exports = function(config) {
	return function(view) {
		return function setView(req, res, next) {
			res.view = view;
			next();
		};
	};
};
