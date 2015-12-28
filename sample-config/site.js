var domain = 'example.com';

var defaults = {
	domain: domain,
	title: 'Example Site',
	name: 'example',
	protocol: 'http',
	get host() {
		return this.port ? this.hostname + ':' + this.port : this.hostname;
	},
	get url () {
		return this.protocol + '://' + this.host + '/';
	},
	emails: {
		robot: 'no-reply@thecodebureau.com',
		info: 'info@thecodebureau.com',
		webmaster: 'webmaster@thecodebureau.com',
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
		hostname: domain,
		emails: {
			robot: 'no-reply@' + domain,
			info: 'info@' + domain,
			webmaster: 'webmaster@' + domain,
		}
	}
}[ENV]);
