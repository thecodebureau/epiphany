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
					'description',
					'details',
					'message',
					'method',
					'name',
					'path',
					'status',
					'statusText'
				],
				'^6': [
					'test',
					'testicle'
				],

				'^5': [
					'body',
					'columnNumber',
					'fileName',
					'ip',
					'lineNumber',
					'query',
					'stack',
					'user',
					'xhr'
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
