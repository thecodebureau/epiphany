var defaults = {
	auth: {
		user: 'user',
		pass: 'pass'
	},
	host: 'smtp.mandrillapp.com',
	port: 587,
	emails: {
		robot: 'no-reply@domain.com',
		info: 'info@domain.com',
		webmaster: 'webmaster@domain.com',
		admin: 'admin@domain.com',
		order: 'admin@domain.com'
	}
};

module.exports = _.merge(defaults, {
	production: {
		emails: {
			robot: 'no-reply@domain.com',
			info: 'info@domain.com',
			webmaster: 'webmaster@domain.com',
			admin: 'admin@domain.com',
			order: 'admin@domain.com'
		}
	}
});
