var domain = 'example.com';

var defaults = {
	title: 'Example Site',
	name: 'example',
	protocol: 'http',
	get host() {
		return this.port ? this.hostname + ':' + this.port : this.hostname;
	},
	get url () {
		return this.protocol + '://' + this.host + '/';
	}
};

module.exports = _.merge(defaults, {
	development: {
		hostname: 'localhost',
		port: process.env.EXTERNAL_PORT || process.env.PORT || require('./port')
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
}[ENV]);
