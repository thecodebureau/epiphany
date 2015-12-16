module.exports = function(url) {
	return function redirect(req, res) {
		res.redirect(url);
	};
};
