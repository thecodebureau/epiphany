var _ = require('lodash');
var fs = require('fs');
var path = require('path');
var dust = require('dustjs-linkedin');

// default prefix that should be prepended to all console.logs/errors
var prefix = 'RES: ';

var debug = typeof DEBUG_RESPONDER === 'boolean' ? DEBUG_RESPONDER : false;

module.exports = function(config) {

	// render/serialize and send response
	function respond(res) {
		_.merge(res.locals, res.data,
			_.pick(res, 'navigation', 'page'),
			_.pick(res.page, 'template'));

		var template = res.locals.template || res.template;
		var formats = {
			html: function () {
				if (debug) console.log(prefix + ' ACCEPTS html, returning html');

				res.render(res.template || res.master || 'master');
			},

			json: function () {
				if (debug) console.log(prefix + ' ACCEPTS json, returning json');

				if(template) {
					var obj = dust.template(template);

					var templates = [ template ];

					if(obj.dependencies) templates = templates.concat(dust.dependencies(template));

					res.json(_.extend({
						template: template,
						compiled: _.map(templates, dust.compiled, dust),
						data: res.locals
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
				if (debug) console.log(prefix + ' Cannot find suitable ACCEPTS, returning status');
				res.sendStatus(res.statusCode || 406);
			}
		};

		if (!template && !res.page) delete formats.html;

		res.format(formats);
	}

	// generates Not Found error if there is no page to render and no truthy values in data
	function responder(req, res, next) {
		if (res.template || res.page || _.some(res.data)) {
			respond(res);
			delete req.session.lastPath;
		} else {
			var err = new Error('Not found: ' + req.path);
			err.status = 404;
			next(err);
		}
	}

	responder.errorHandler = function(err, req, res, next) {
		res.data = { error: err };
		res.locals.template = 'error';
		respond(res);
	};

	return responder;
};
