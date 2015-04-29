require('./globals')();

var config = {
	dir: require('./dir'),
	globals: require('./globals'),
	server: require('./server')
};
config.site = require('./site')(config);

module.exports = config;
