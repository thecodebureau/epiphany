module.exports = function(mw, config) {
	// this route basically check the data object
	// if there is only one type of data attached to it
	// (this can be a model/object or collection/array)
	// and only return that if so.
	function returnSingle(req, res, next) {
		var keys = Object.keys(res.data);
		if (keys.length == 1) res.data = res.data[keys[0]];
		next();
	}

	return [
		[ 'after', null, returnSingle ]
	];
};
