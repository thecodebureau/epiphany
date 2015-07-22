// modules > native
var fs = require('fs');
var nodePath = require('path');

// modules > 3rd party
global._ = require('lodash');
var dust = require('dustjs-linkedin');
var mongoose = require('mongoose');

var express = require('express');

// modules > express middlewares
var bodyParser = require('body-parser');
var session = require('express-session');
var cookieParser = require('cookie-parser');

var loaders = require('./loaders');


// set up some globals
global.ENV = global.ENV || process.env.NODE_ENV || 'development';
global.PWD = global.PWD || process.env.PWD;

var Epiphany = function(options) {
	this.options = options = options || {};
	
	var configs = [ __dirname + '/config' ];

	if(options.config)
		configs = configs.concat(options.config);

	if(fs.existsSync(PWD + '/server/config')) configs.push(PWD + '/server/config');

	this.config = loaders.config(configs);

	this.mongoose = require('mongoose');

	this.express = require('express');

	this.server = require('./express-setup')(this.config);


	this.directories = {
		models: [ __dirname + '/models', this.config.dir.server.models ],
		mw: [ __dirname + '/middleware', this.config.dir.server.middleware ],
		routes: [ __dirname + '/routes', this.config.dir.server.routes ],
		schemas: [ this.config.dir.server.schemas, __dirname + '/schema.org' ],
		plugins: [ this.config.dir.server.plugins, __dirname + '/plugins' ],
		templates: [ __dirname + '/templates', this.config.dir.server.templates ]
	};

	this.loaders = loaders;

	this.prewares = [];

	this.postwares = [];

	if(options.load !== false) this.load();

	if(options.init !== false) this.init();

	return this;
};

// Loads all components except configuration (which is loaded in the constructor).
Epiphany.prototype.load = function() {
	_.mapValues(this.directories, function(val) {
		return _.compact(val);
	});

	dust.templates = loaders.templates(this.directories.templates);

	// load all models into mongoose instance (reachable through require('mongoose').model('ModelName'))
	loaders.mongoose(this.directories.models, this.directories.plugins, this.directories.schemas);

	if (this.config.session.redis) {
		var RedisStore = require('connect-redis')(session);

		var redisStore = new RedisStore(this.config.session.redis);
		redisStore.on('connect', function(){
			console.log("Redis connected succcessfully"); });
		redisStore.on('disconnect', function(){
			console.error("Unable to connect to redis. Has it been started?"); });
		this.config.session.store = redisStore;
	}

	this.mw = {
		static: express.static(this.config.dir.public.root),
		bodyParser: [ bodyParser.json(), bodyParser.urlencoded({ extended:true }) ],
		cookieParser: cookieParser(),
		session: session(this.config.session)
	};

	_.merge(this.mw, loaders.middleware(this.directories.mw, this.config));

	if(fs.existsSync(PWD + '/server/navigation.js')) {
		this.config.navigation = require(PWD + '/server/navigation.js')(this.mw);
		_.each(this.config.navigation, function(routes, key) {
			if(key !== 'redirects') {
				(function recurse(routes, tree) {
					tree = tree || [];
					_.map(routes, function(route) {

						if(!route.name)
							if(route.title)
								route.name = route.title.toSpinalCase().replace(/[åä]/g, 'a').replace(/ö/g, 'o').toSpinalCase();
							else if (!route.path)
								throw new Error('Route without name, title and path!');


						var path = route.path ? _.compact(route.path.split('/')) : tree.concat(route.name);

						if(!route.path) 
							route.path = '/' + path.join('/');

						if(route.view === true || route.view === 1)
							route.view = route.title;

						if(route.nav !== false)
							route.nav = true;

						if(!route.template)
							route.template = (key === 'admin' ? key + '/' : '') + 'pages/' + path.join('/');
						else if(/^:l/.test(route.template))
							route.template = 'admin/pages/landing';

						if(!dust.cache[route.template]) {
							route.template = nodePath.join(route.template, 'index');
							if(!dust.cache[route.template])
								throw new Error('No template found for route: ' + route.path);
						}


						if(_.isArray(route.sub))
							recurse(route.sub, path);

						return route;
					});
				})(routes);
			}
		});
	}

	this.routes = loaders.routes(this.directories.routes, this.express, this.mw, this.config);

	return this;
};

// Init only sets up prewares and postwares
Epiphany.prototype.init = function() {

	this.prewares = this.prewares.concat([
		this.mw.static,
		this.mw.bodyParser,
		this.mw.cookieParser,
		this.mw.session
	]);

	if(ENV === 'development') {
		this.prewares.unshift(require('morgan')('dev'));
	}

	this.postwares = this.postwares.concat([
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
	]);

	return this;
};

Epiphany.prototype.dust = dust;

Epiphany.prototype.dustModule = function(obj) {
	_.each(obj, function(entities, type) {
		_.each(entities, function(entity, name) {
			dust[type][name] = entity;
		});
	});
};

// set ups prewares that won't work in a _pre.js route file.
Epiphany.prototype.setPre = function() {
	this.prewares.forEach(function(mw, i) {
		if(_.isArray(mw) && _.isString(mw[0]))
			this.server.use(mw[0], mw[1]);
		else
			this.server.use(mw);

	}.bind(this));

	this._pred = true;
};

Epiphany.prototype.initRoutes = function(router) {
	var _app = this;

	if(!this._pred) this.setPre();

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

	this._routed = true;
};

// set ups postwares that won't work in a _pre.js route file.
Epiphany.prototype.setPost = function() {
	if(!this._routed) this.initRoutes();

	this.postwares.forEach(function(mw) {
		this.server.use(mw);
	}.bind(this));

	// set up postware
	this._posted = true;
};

Epiphany.prototype.start = function() {
	if(!this._posted) this.setPost();
	
	// connect to mongodb
	mongoose.connect(this.config.mongo.uri, this.config.mongo.options);


	// start server and let them know it
	this.server.listen(this.config.port); 
	console.log('Express server started on port %s (%s)', this.config.port, ENV);

	this._listening = true;
};

module.exports = Epiphany;
