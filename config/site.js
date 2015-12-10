module.exports = function(config) {
	if(!config.port || !_.isNumber(config.port)) throw new Error('Port undefined or not a number');

	var domain = 'changethisfool.com';

	var c = {
		defaults: {
			title: 'Change This Fool',
			name: 'change-this-fool',
			protocol: 'http',
			get host() {
				return this.port ? this.hostname + ':' + this.port : this.hostname;
			},
			get url () {
				return this.protocol + '://' + this.host + '/';
			}
		},

		development: {
			hostname: 'localhost',
			port: process.env.EXTERNAL_PORT || config.port
		},

		testing: {
			hostname: 'testing.' + domain
		},

		staging: {
			hostname: 'staging.' + domain
		},

		production: {
			hostname: domain
		}
	};

	return _.merge(c.defaults, c[ENV]);
};

