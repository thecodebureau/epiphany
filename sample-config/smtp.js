var defaults = {
	auth: {
		user: 'user',
		pass: 'pass'
	},
	host: 'smtp.mandrillapp.com',
	port: 587
};

module.exports = _.merge(defaults, {
}[ENV]);
