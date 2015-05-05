// modules > native
var fs = require('fs');

// modules > 3rd party
var _ = require('lodash');
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
		templates: [ __dirname + '/templates', this.config.dir.server.templates ]
	};

	this.loaders = loaders;

	this.prewares = [];

	this.postwares = [];

	if(options.init !== false) this.init();

	if(options.load !== false) this.load();

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

	this.postwares = this.postwares.concat([ this.mw.responder, this.mw.errorHandler ]);

	return this;
};

Epiphany.prototype.dust = function(obj) {
	_.each(obj, function(entities, type) {
		_.each(entities, function(entity, name) {
			dust[type][name] = entity;
		});
	});
};

// Loads all components except configuration (which is loaded in the constructor).
Epiphany.prototype.load = function() {
	dust.templates = loaders.templates(this.directories.templates);

	// load all models into mongoose instance (reachable through require('mongoose').model('ModelName'))
	loaders.models(this.directories.models, this.directories.schemas);

	this.mw = {
		static: express.static(this.config.dir.public.root),
		bodyParser: [ bodyParser.json(), bodyParser.urlencoded({ extended:true }) ],
		cookieParser: cookieParser(),
		session: session(this.config.session)
	};

	_.merge(this.mw, loaders.middleware(this.directories.mw, this.config));

	this.routes = loaders.routes(this.directories.routes, this.express, this.mw, this.config);
};

// set ups prewares that won't work in a _pre.js route file.
Epiphany.prototype.setPre = function() {
	this.prewares.forEach(function(mw, i) {
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
