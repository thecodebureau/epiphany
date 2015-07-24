module.exports = {
	defaults: {
		mystify: {
			properties: [ 'message', 'name', 'status', 'statusText' ]
		},
		log: {
			// if database = true there has to be a mongoose model name ErrorModel
			ignore: [],
		}
	},
	development: {
		log: {
			database: false,
			console: true,
		}
	},
	production: {
		log: {
			database: true,
			console: false,
		}
	},
};
