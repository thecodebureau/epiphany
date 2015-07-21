var _ = require('lodash');

module.exports = function(config) {
	if(!config.port || !_.isNumber(config.port)) throw new Error("'config.port' is not a number");

	return {
		development: 'localhost:' + config.port,
		testing: 'changeThisFool.testing.thecodebureau.com',
		staging: 'changeThisFool.thecodebureau.com',
		production: 'www.changeThisFool.se'
	}[ENV];
};
