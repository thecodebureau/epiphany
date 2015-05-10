module.exports = {
	defaults: {
		mystify: {
			properties: [ 'details', 'message', 'status', 'statusText' ]
		},
		log: {
			// if database = true there has to be a mongoose model name ErrorModel
			ignore: [],
			properties: {
				'.*': [
					'details',
					'message',
					'name',
					'status',
					'statusText',
					'description'
				],
				'404': [
					'path'
				],
				'^5': [
					'stack',
					'columnNumber',
					'fileName',
					'lineNumber'
				],
			}
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
