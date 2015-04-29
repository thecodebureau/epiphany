// MODULES

// modules > native
var path = require('path');

// modules > 3rd party
var _ = require('lodash');

var basePort = 10000;

var port = {
	development: basePort,
	testing: basePort + 1,
	staging: basePort + 2,
	production: basePort + 3
};

var errorHandler = {
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

var mongo = {
	defaults: {
		uri: 'mongodb://localhost/changeThisFool' 
		//uri: 'mongodb://user:password@tcb01.thecodebureau.com/changeThisFool' 
	},
	development: {
		//uri: 'mongodb://user:password@tcb01.thecodebureau.com/changeThisFoolDev' 
		uri: 'mongodb://localhost/changeThisFoolDev' 
	}
};

var session = {
	defaults: {
		secret: 'changeThisFool',
		resave: true,
		saveUninitialized: true,
		redis: {
			port: 6379,
			host: 'localhost'
		}
	},
	//development: {
	//	redis: null
	//}
};

module.exports = {
	errorHandler: _.merge(errorHandler.defaults, errorHandler[ENV]),
	mongo: _.merge(mongo.defaults, mongo[ENV]),
	passport: _.merge(passport.defaults, passport[ENV]),
	session: _.merge(session.defaults, session[ENV]),
	port: port[ENV]
};
