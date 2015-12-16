var defaults = {
	uri: 'mongodb://energymanSupreme:energize--the-management@mongo.thecodebureau.com/energyman' 
	//uri: 'mongodb://localhost/energyman' 
};

module.exports = _.merge(defaults, {
	//production: {
	//	uri: 'mongodb://localhost/liverpooltravel' 
	//}
});
