module.exports = function(req, res, next) {
	req.query = _.mapValues(req.query, function(value, key) {
		value = decodeURIComponent(value);

		if(/^\//.test(value)) {
			var arr = value.match(/\/(.*)\/(.*)/);
			value = new RegExp(arr[1], arr[2] || undefined);
		}

		return value;
	});

	next();
};
