var evals = [ 'undefined', 'null', 'false', 'true' ];

var _filters = {
	regex: function(value) {
		return new RegExp(value, 'i');
	},

	exists: function(value) {
		if(value === true)
			return { $ne: null };
		else 
			return { $eq: null };
	}
};

module.exports = function(properties, filters) {
	properties = _.union(properties, _.keys(filters));

	filters = _.mapValues(filters, function(value, key) {
		return _.isString(value) ? _filters[value] : value;
	});

	return function(req, res, next) {
		req.query = _.mapValues(_.pick(req.query, properties), function(value, key) {
			value = decodeURIComponent(value);

			if(evals.indexOf(value) > -1) value = eval(value);

			return filters[key] ? filters[key](value) : value;
		});

		next();
	};
};
