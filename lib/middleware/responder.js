var _ = require('lodash');
var fs = require('fs');
var path = require('path');
var dust = require('dustjs-linkedin');

// default prefix that should be prepended to all console.logs/errors
var prefix = 'RES: ';

var debug = typeof DEBUG_RESPONDER === 'boolean' ? DEBUG_RESPONDER : false;

module.exports = function responder(config) {
	return function (req, res, next) {

		if (debug) {
			//console.log(prefix + '[req.session] ' + JSON.stringify(req.session));
			//console.log(prefix + '[req.user] ' + JSON.stringify(req.user));
			//console.log(prefix + '[req.url] ' + req.url);
			//console.log(prefix + '[req.headers] ' + JSON.stringify(req.headers).replace(/",/g, '",\n   '));
			//console.log(prefix + '[res.headers] ' + (typeof res.headers === 'object' ? JSON.stringify(res.headers).replace(/",/g, '",\n   ') : ''));
			//console.log(prefix + '[res.locals] ' + JSON.stringify(res.locals));
			//console.log(prefix + '[res.data] ' + JSON.stringify(res.data));
		}

		if(!req.route) {
			var err;

			if(/\.\w+$/.test(req.url))
				err = new Error('Static resource not found: ' + req.url);
			else
				err = new Error('Route does not exist.');
			err.status = 404;

			return next(err);
		}


		res.format({
			html: function () {
				if (debug) console.log(prefix + ' ACCEPTS html, returning html');

				_.merge(res.locals, res.data);

				//if(!res.template) {
				//	var err = new Error('Route exists, but you required HTML and no template was found. Sorry!');
				//	err.status = 500;
				//	next(err);
				//} else {
				
				res.render(res.master || 'master');
				//}
			},

			json: function () {
				if (debug) console.log(prefix + ' ACCEPTS json, returning json');

				if(res.template) {
					var obj = dust.template(res.template);

					var templates = [ res.template ];

					if(obj.dependencies) templates = templates.concat(dust.dependencies(res.template));

					res.json({
						template: res.template,
						compiled: _.map(templates, dust.compiled, dust),
						data: res.data
					});
				} else {
					res.json(res.data);
				}
			},

			text: function () {
				// TODO sexy text return
				if (debug) console.log(prefix + ' ACCEPTS text, returning text');
				res.send('We currently do not support pure text. Sorry.');
			},

			default: function () {
				if (debug) console.log(prefix + ' Cannot find suitable ACCEPTS, returning 406 error');
				var err = new Error();
				err.statusCode = 406;
				return next(err);
			}
		});

		delete req.session.lastPath;
	};
};