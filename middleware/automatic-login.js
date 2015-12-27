var mongoose = require('mongoose');

/* Middleware simply for simplying when in development
 * mode so that you do not have to re-login everytime the
 * node server reboots. set global.LOGIN_USER to the user you wish
 * to automatically login as.
 */

module.exports = function pre(req, res, next) {
	if (ENV === 'development' && global.LOGIN_USER && !req.user) {
		var User = mongoose.model('User');

		User.findOne({ email: LOGIN_USER }, function (err, user) {
			if (err) return next(err);

			req.login(user, function (err) {
				if (err) return next(err);
				
				next();
			});
		});
	} else {
		next();
	}
};
