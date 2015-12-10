module.exports = {
	defaults: {
		uri: 'mongodb://localhost/changethisfool' 
		//uri: 'mongodb://user:password@mongo.thecodebureau.com/changethisfool' 
	},
	production: {
		uri: 'mongodb://user:password/localhost/changethisfool' 
		//uri: 'mongodb://user:password@mongo.thecodebureau.com/changethisfool' 
	}
};
