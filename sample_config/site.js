var _ = require('lodash');

module.exports = function(config) {
	var details = {
		defaults: {
			title: 'A Bear Bone Package',
			name: 'bear-bone'
		}
	};


	var domain = {
		development: 'localhost:' + config.server.port,
		testing: 'changeThisFool.testing.thecodebureau.com',
		staging: 'changeThisFool.thecodebureau.com',
		production: 'www.changeThisFool.se'
	};

	return {
		details: _.merge(details.defaults, details[ENV]),
		domain: domain[ENV]
	};
};
