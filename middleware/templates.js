var dust = require('dustjs-linkedin');

module.exports = function templates(req, res, next) {
	if(req.params) {
		res.locals.template = req.params[0];

		res.locals.compiled = _.map([ res.locals.template ].concat(dust.dependencies(res.locals.template)), dust.compiled, dust);
	}

	next();
};
