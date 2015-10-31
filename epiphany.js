// modules > native
var fs = require('fs');
var p = require('path');

// modules > 3rd party
var dust = require('dustjs-linkedin');
var chalk = require('chalk');
var express = require('express');
var mongoose = require('mongoose');
var requireDir = require('require-dir');

// modules > express middlewares
var bodyParser = require('body-parser');
var session = require('express-session');
var cookieParser = require('cookie-parser');

// modules > internal
var loaders = require('./loaders');
var colorizeStack = require('./util/colorize-stack');
var logError = require('./util/log-error');

// extend dust and mongoose
require('./dust-extensions');
require('./mongoose-extensions');

// app-module-path paths do not persist to modules installed in node_modules
// (not symlinked), so to access custom module paths (ie PWD/modules) we need
// to union current model.paths with main module's paths.
module.paths = _.union(module.paths, require.main.paths); 

var Epiphany = function(options) {
	var _app = this;

	this.options = options = options || {};

	// set up references to instances that might be needed later
	this.mongoose = mongoose;
	this.express = express;

	this.dust = dust;
	
	// load configuration
	this.config = loaders.config(_.compact([ PWD + '/server/config', options.config ]));

	// set default configuration in error logger
	logError.setConfig(this.config.errorHandler.log);

	// connect to mongodb
	mongoose.connect(this.config.mongo.uri, this.config.mongo.options);

	if (this.config.session.redis) {
		var RedisStore = require('connect-redis')(session);

		var redisStore = new RedisStore(this.config.session.redis);
		redisStore.on('connect', function(){
			console.info("Redis connected succcessfully"); });
		redisStore.on('disconnect', function(){
			console.error("[" + chalk.red('ERROR') + "]  Unable to connect to redis. Has it been started?"); 
			process.exit(2);
		});
		this.config.session.store = redisStore;
	}

	var mw = {
		static: express.static(this.config.dir.public.root, ENV === 'production' ? { maxAge: '1 year' } : null),
		bodyParser: [ bodyParser.json(), bodyParser.urlencoded({ extended:true }) ],
		cookieParser: cookieParser(),
		session: session(this.config.session)
	};

	this.items = {
		models: [ __dirname + '/models', PWD + '/server/models' ],
		mw: [ __dirname + '/middleware', mw, PWD + '/server/middleware' ],
		pages: [],
		routes: [ __dirname + '/routes', PWD + '/server/routes' ],
		schemas: [ __dirname + '/schemas', PWD + '/server/schemas' ],// (mongoose schemas)
		plugins: [ __dirname + '/plugins', PWD + '/server/plugins' ],// (mongoose plugins)
		templates: [ __dirname + '/templates', PWD + '/server/templates' ],
		setup: []
	};

	// remove all duplicate items
	// RBNNOTE: What does this do? It returns without assigning to a var
	// Also it does not remove duplicate items but removes falsey values
	_.mapValues(this.items, function(val) {
		return _.compact(val);
	});

	_.each(options.modules, function(module) {
		_app.module(module);
	});

	// add mw, config and what not from
	this.module(options, true);

	// setup express
	this.server = require('./express-setup')(this.config);

	// load all models into mongoose instance (reachable through require('mongoose').model('ModelName'))
	loaders.mongoose(this.items.models, this.items.plugins, this.items.schemas, this);

	this.mw = loaders.middleware(this.items.mw, this.config);

	dust.templates = loaders.templates(this.items.templates);

	// pages need to be loaded after templates, mw so loader can ensure existence of page template, mw
	var pages = loaders.pages(this.items.pages, this);

	this.paths = pages.paths;
	this.navigation = pages.navigation;

	this.items.routes.splice(1,0, pages.routes);

	this.routes = loaders.routes(this.items.routes, this.mw, this);

	// set up default prewares
	this.prewares = [
		this.mw.static,
		this.mw.bodyParser,
		this.mw.cookieParser,
		this.mw.session,
		this.mw.pre
	];

	if(ENV === 'development') {
		this.prewares.unshift(require('morgan')('dev'));
	}

	// set up default postwares
	this.postwares = [
		this.mw.ensureFound,
		// transform and log error
		this.mw.errorHandler,
		// respond
		this.mw.responder,
		// handle error rendering error
		function(err, req, res, next) {
			// TODO pretty print
			console.error('[!!!] ERROR IN RESPONDER');
			console.error(err);

			if(err)
				console.error(colorizeStack(err.stack));

			if(res.locals.error) {
				console.error('[!!!] ORIGINAL ERROR');
				console.error(_.omit(res.locals.error, 'stack'));

				if(res.locals.error.stack)
					console.error(ENV === 'development' ? formatStack(res.locals.error.stack) : res.locals.error.stack);
			}
			res.send((res.locals.error || err) + '');
		}
	];

	this.items.setup.forEach(function(fnc) {
		fnc(_app);
	});

	if(options.start !== false) this.start();

	return this;
};

Epiphany.prototype.preware = function(newPreware, method, reference) {
	ware.apply(this, [ 'prewares' ].concat(_.toArray(arguments)));
};

Epiphany.prototype.postware = function(newPreware, method, reference) {
	ware.apply(this, [ 'postwares' ].concat(_.toArray(arguments)));
};

function ware(type, newWare, method, ref) {
	var arr = this[type];

	method = method || 'push';
	if(method === 'before' || method === 'after') {
		var index = arr.indexOf(ref);

		if(index < 0) 
			throw new Error('Reference element not found!');

		arr.splice(method === 'before' ? index : index + 1, 0, newWare);
	} else 
		arr[method](newWare);
}

Epiphany.prototype.module = function(module, last) {
	var _app = this;

	if(_.isString(module)) 
		module = require(/\.\//.test(module) ? p.join(PWD, module) : module);

	// pick (order matters!)
	var props = [
			'models',
			'mw',
			'navigation',
			'pages',
			'plugins',
			'routes',
			'schemas',
			'setup',
			'templates',
	];
	
	_.each(_.pick(module, props), function(value, key) {
		// splice at index -1 to make sure PWD/server/ items are always last and are able
		// to override anything set by epiphany or components
		var items = _app.items[key];
		if(last || items.length === 0)
			items.push(value);
		else
			items.splice(-1, 0, value);
	});

	_.merge(dust, _.pick(module, 'filters', 'helpers'));
};

Epiphany.prototype.start = function() {
	var _app = this;

	_app.server.locals.lang = process.env.NODE_LANG || 'en';

	var jsFile = p.join(PWD, 'public/js.json');

	if(fs.existsSync(jsFile))
		_app.server.locals.js = require(jsFile);

	var cssFile = p.join(PWD, 'public/css.json');

	if(fs.existsSync(jsFile))
		_app.server.locals.css = require(cssFile);

	this.prewares.forEach(function(mw, i) {
		if(_.isArray(mw) && _.isString(mw[0]))
			_app.server.use(mw[0], mw[1]);
		else
			_app.server.use(mw);

	});

	// sort routes by name, make ':' & '*' routes be placed behind all the others.
	this.routes = _.object(_.sortBy(_.pairs(this.routes), function(pair) { 
		return pair[0].split(':').join('zzzy').split('*').join('zzzz');
	}));

	var afters = [];

	_.each(this.routes, function(route, path) {
		// ensure all middlewares are functions
		_.each(route, function(mw, method) {
			if(!_.isFunction(mw) && (_.isEmpty(mw) || _.some(mw, function(value) { return !_.isFunction(value); }))) {
				throw new Error('Undefined or non-function as middleware for [' + method + ']:' + path);
			}
		});

		afters.forEach(function(after, i) {
			if(path.indexOf(after[0]) !== 0) {
				_app.server.use(after[0], after[1]);
				afters.splice(i, 1);
			}
		});

		if(route.before) {
			_app.server.use(path, route.before);
		}

		_.each(_.omit(route, [ 'before', 'after' ]), function(mw, method) {
			_app.server[method](path, mw);
		});

		if(route.after) {
			afters.push([ path, route.after ]);
		}
	});

	// initialize postwares (from old setPost)
	this.postwares.forEach(function(mw) {
		_app.server.use(mw);
	});

	// start server and let them know it
	this.server.listen(this.config.port); 
	console.info('Express server started on port %s (%s)', this.config.port, ENV);

	this._listening = true;
};

module.exports = Epiphany;
