module.exports = {
	defaults: {
		secret: 'changeThisFool',
		resave: true,
		saveUninitialized: true
	},
	production: {
		redis: {
			port: 6379,
			host: 'localhost'
		}
	}
};

