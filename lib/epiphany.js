// modules > native
var fs = require('fs');
var p = require('path');

// modules > 3rd party
var _ = require('lodash');
var appModulePath = require('app-module-path');
var dust = require('dustjs-linkedin');
var express = require('express');
var mongoose = require('mongoose');
var requireDir = require('require-dir');

// modules > express middlewares
var bodyParser = require('body-parser');
var session = require('express-session');
var cookieParser = require('cookie-parser');

// globals
global._ = _;

var loaders = require('./loaders');

// first path is only needed when epiphany has been symlinked (npm link)
appModulePath.addPath(p.join(process.env.PWD, 'node_modules'));
appModulePath.addPath(p.join(process.env.PWD, 'components'));
appModulePath.addPath(p.join(p.dirname(__dirname),  'components'));

// set up some globals
global.ENV = global.ENV || process.env.NODE_ENV || 'development';
global.PWD = global.PWD || process.env.PWD;


var Epiphany = function(options) {
	var _app = this;

	this.options = options = options || {};

	// set up references to instances that might be needed later
	this.mongoose = mongoose;
	this.express = express;
	// TODO decide whether to get dust like this, or make it peerDependency
	this.dust = dust;
	
	this.config = loaders.config(_.compact([ PWD + '/server/config', options.config ]));

	// connect to mongodb
	mongoose.connect(this.config.mongo.uri, this.config.mongo.options);

	var mw = {
		static: express.static(this.config.dir.public.root),
		bodyParser: [ bodyParser.json(), bodyParser.urlencoded({ extended:true }) ],
		cookieParser: cookieParser(),
		session: session(this.config.session)
	};

	this.items = {
		models: [ __dirname + '/models', PWD + '/server/models' ],
		mw: [ __dirname + '/middleware', mw, PWD + '/server/middleware' ],
		navigation: [],
		routes: [ __dirname + '/routes', PWD + '/server/routes' ],
		schemas: [ __dirname + '/schemas', PWD + '/server/schemas' ],
		plugins: [ __dirname + '/plugins', PWD + '/server/plugins' ],
		templates: [ __dirname + '/templates', PWD + '/server/templates' ],
		setup: []
	};

	// remove all duplicate items
	_.mapValues(this.items, function(val) {
		return _.compact(val);
	});

	_.each(options.modules, function(module) {
		_app.module(module);
	});

	// add mw, config and what not from
	this.module(options, true);

	this.server = require('./express-setup')(this.config);

	// load all models into mongoose instance (reachable through require('mongoose').model('ModelName'))
	loaders.mongoose(this.items.models, this.items.plugins, this.items.schemas);

	this.mw = loaders.middleware(this.items.mw, this.config);

	dust.templates = loaders.templates(this.items.templates);

	this.navigation = loaders.navigation(this.items.navigation, this.mw);

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
			console.error('render error');
			console.error(err);
			console.error('original error');
			console.error(res.locals.error);
			res.send(res.locals.error + '');
		}
	];

	this.items.setup.forEach(function(fnc) {
		fnc(_app);
	});

	if (this.config.session.redis) {
		var RedisStore = require('connect-redis')(session);

		var redisStore = new RedisStore(this.config.session.redis);
		redisStore.on('connect', function(){
			console.log("Redis connected succcessfully"); });
		redisStore.on('disconnect', function(){
			console.error("Unable to connect to redis. Has it been started?"); });
		this.config.session.store = redisStore;
	}

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

Epiphany.prototype.dustModule = function(obj) {
	_.each(obj, function(entities, type) {
		_.each(entities, function(entity, name) {
			dust[type][name] = entity;
		});
	});
};

Epiphany.prototype.module = function(module, last) {
	var _app = this;

	if(_.isString(module)) 
		module = require(/\.\//.test(module) ? p.join(PWD, module) : module);

	// pick (order matters!)
	module = _.pick(module, [ 'models', 'mw', 'routes', 'navigation', 'templates', 'setup' ]);
	
	_.each(module, function(value, key) {
		// splice at index -1 to make sure PWD/server/ items are always last and are able
		// to override anything set by epiphany or components
		var items = _app.items[key];
		if(last || items.length === 0)
			items.push(value);
		else
			items.splice(-1, 0, value);
	});
};

Epiphany.prototype.start = function() {
	var _app = this;

	// initialize prewares (from old setPre)
	this.prewares.forEach(function(mw, i) {
		if(_.isArray(mw) && _.isString(mw[0]))
			_app.server.use(mw[0], mw[1]);
		else
			_app.server.use(mw);

	});

	// initialize routes (from old initRoutes)
	var afters = [];

	_.each(this.routes, function(route, path) {
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

	if(this.navigation && this.navigation.redirects)
		this.navigation.redirects.forEach(function(arr) {
			_app.server.get(arr[0], function redirect(req, res) {
				res.redirect(arr[1]);
			});
		});

	// initialize postwares (from old setPost)
	this.postwares.forEach(function(mw) {
		_app.server.use(mw);
	});

	// start server and let them know it
	this.server.listen(this.config.port); 
	console.log('Express server started on port %s (%s)', this.config.port, ENV);

	this._listening = true;
};

module.exports = Epiphany;
