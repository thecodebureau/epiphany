var evals = [ 'undefined', 'null', 'false', 'true' ];

module.exports = function(req, res, next) {
	req.query = _.mapValues(req.query, function(value, key) {
		value = decodeURIComponent(value);

		var arr;

		// TODO this test for regex strings will match paths whos last component only contain valid flags(i, g, m). For examaple: /path/img
		if(/^\/.*\/[gim]*$/.test(value)) {
			arr = value.match(/\/(.*)\/(.*)/);
			value = new RegExp(arr[1], arr[2] || undefined);
		} else if(/=/.test(value)) {
			arr = value.split('=');

			value = {};

			value[arr[0]] = evals.indexOf(arr[1]) > -1 ? eval(arr[1]) : arr[1];
		}

		return value;
	});

	next();
};
