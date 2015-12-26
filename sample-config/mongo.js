var defaults = {
	uri: 'mongodb://user:pass@mongo.thecodebureau.com/example' 
	//uri: 'mongodb://localhost/example' 
};

module.exports = _.merge(defaults, {
	//production: {
	//	uri: 'mongodb://user:pass@localhost/example' 
	//}
});
