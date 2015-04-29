var _ = require('lodash');
var dust = require('dustjs-linkedin');

module.exports = function(config) {
	return function(req, res, next) {
		if(req.params) {
			res.template = req.params[0];
		}
		next();
	};
};
