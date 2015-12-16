module.exports = function templates(req, res, next) {
	if(req.params) {
		res.data.template = req.params[0];
	}
	next();
};
