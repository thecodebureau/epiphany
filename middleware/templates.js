// modules > 3rd party
var dust = require('dustjs-linkedin');

module.exports = function(config) {
	return function(req, res, next) {
		if(req.params) {
			res.data.template = req.params[0];
		}
		next();
	};
};
