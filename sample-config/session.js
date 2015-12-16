var defaults = {
	secret: 'changeThisFool',
	resave: true,
	saveUninitialized: true
};

module.exports = _.merge(defaults, {
	production: {
		redis: {
			port: 6379,
			host: 'localhost'
		}
	}
}[ENV]);

