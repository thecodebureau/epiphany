module.exports = function(config) {
	if(!config.port || !_.isNumber(config.port)) throw new Error('Port undefined or not a number');

	return {
		development: 'localhost:' + config.port,
		testing: 'changeThisFool.testing.thecodebureau.com',
		staging: 'changeThisFool.thecodebureau.com',
		production: 'www.changeThisFool.se'
	}[ENV];
};
