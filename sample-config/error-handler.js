var defaults = {
	mystify: {
		properties: [ 'message', 'name', 'status', 'statusText' ]
	},
	log: {
		// if database = true there has to be a mongoose model name ErrorModel
		ignore: [],
	}
};

module.exports = _.merge(defaults, {
	development: {
		log: {
			database: true,
			console: true,
		}
	},
	production: {
		log: {
			database: true,
			console: false,
		}
	},
}[ENV]);
