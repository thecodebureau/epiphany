var defaults = {
	database: false,
	console: true,
};

module.exports = _.merge(defaults, {
	production: {
		database: true,
		console: false,
	},
}[ENV]);
