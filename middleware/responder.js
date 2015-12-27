// modules > 3rd party
var debug = require('debug')('epiphany:responder');

module.exports = function responder(req, res, next) {
	var formats = {
		html: function () {
			debug('ACCEPTS html, returning html');

			res.render(res.template || res.master || 'master');
		},

		json: function () {
			debug('ACCEPTS json, returning json');

			/* if there is only a single property on `res.locals` and it is not a page
			 * object (this can be a model/object or collection/array) then only
			 * return that property.
			 */
			var keys = Object.keys(res.locals);

			res.json(keys.length === 1 && keys[0] !== 'page' ? res.locals[keys[0]] : _.omit(res.locals, 'query'));
		},

		default: function () {
			debug('Cannot find suitable ACCEPTS, returning status');

			res.sendStatus(res.statusCode || 406);
		}
	};

	res.format(formats);
};
