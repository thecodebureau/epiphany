var router = require('express').Router();

router.root = '/templates';

module.exports = function(mw, config) {
	router.get('/*', mw.tcb.templates);

	return router;
};
