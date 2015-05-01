
module.exports = function(express, mw, config) {
	var router = express.Router();
	// this route basically check the data object
	// if there is only one type of data attached to it
	// (this can be a model/object or collection/array)
	// and only return that if so.
	router.use(function(req, res, next) {
		var keys = Object.keys(res.data);
		if (keys.length == 1) res.data = res.data[keys[0]];
		next();
	});

	return router;
};
