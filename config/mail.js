
module.exports = {
	defaults: {
		auth: {
			user: 'user',
			pass: 'password'
		},
		host: 'smtp.mandrillapp.com',
		port: 587,
		//service: 'Gmail',
		//auth: {
		//	user: 'email@gmail.com',
		//	pass: 'password'
		//},
		emails: {
			robot: 'no-reply@domain.com',
			info: 'info@domain.com',
			webmaster: 'webmaster@domain.com',
			admin: 'admin@domain.com',
			order: 'order@domain.com',
		},
	},
};
