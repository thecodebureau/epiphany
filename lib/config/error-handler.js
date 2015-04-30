module.exports = {
	defaults: {
		mystify: {
			properties: [ 'details', 'message', 'status', 'statusText' ]
		},
		log: {
			// if database = true there has to be a mongoose model name ErrorModel
			database: false,
			console: true,
			ignore: [],
			properties: {
				'.*': [
					'columnNumber',
					'details',
					'fileName',
					'lineNumber',
					'message',
					'name',
					'status'
				],
				'^5': [
					'stack'
				],
			}
		}
	}
};
