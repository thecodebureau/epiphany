var _ = require('lodash');

module.exports = function(config) {
	if(!_.isNumber(config.port)) throw new Error();

	return {
		development: 'localhost:' + config.port,
		testing: 'changeThisFool.testing.thecodebureau.com',
		staging: 'changeThisFool.thecodebureau.com',
		production: 'www.changeThisFool.se'
	}[ENV];
};
