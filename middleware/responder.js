// modules > 3rd party
var dust = require('dustjs-linkedin');
var debug = require('debug')('epiphany:responder');

module.exports = function responder(req, res, next) {
	// NOTE little performance gain for API calls if this is only done when needed?
	_.merge(res.locals, res.data);

	var formats = {
		html: function () {
			debug('ACCEPTS html, returning html');

			res.render(res.master || 'master');
		},

		json: function () {
			debug('ACCEPTS json, returning json');

			var template = res.locals.template;

			if(template) {
				// only set error template if another template has been set
				if(res.statusCode > 400) template = dust.cache[res.statusCode] || 'error';

				var obj = dust.template(template);

				var templates = [ template ];

				if(obj.dependencies) templates = templates.concat(dust.dependencies(template));

				res.json(_.extend({
					template: template,
					compiled: _.map(templates, dust.compiled, dust),
					data: res.locals,
				}, _.pick(res.locals.page, 'view')));
			} else {
				// if there is only a single value in the data object
				// (this can be a model/object or collection/array)
				// then only return that value.
				var keys = Object.keys(res.data);
				res.json(keys.length == 1 ? res.data[keys[0]] : res.data);
			}
		},

		default: function () {
			debug('Cannot find suitable ACCEPTS, returning status');
			res.sendStatus(res.statusCode || 406);
		}
	};

	res.format(formats);

	if(req.path !== '/login')
		delete req.session.lastPath;
};
