module.exports = function(express, mw, config) {
	var router = express.Router();
	router.root = '/templates';

	router.get('/*', mw.tcb.templates);

	return router;
};
