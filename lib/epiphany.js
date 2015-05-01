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
	options = options || {};
	
	var configs = [ __dirname + '/config' ];

	if(options.config)
		configs = configs.concat(options.config);

	if(fs.existsSync(PWD + '/server/config')) configs.push(PWD + '/server/config');

	this.config = loaders.config(configs);

	this.directories = {
		models: [ __dirname + '/models', this.config.dir.server.models ],
		mw: [ __dirname + '/middleware', this.config.dir.server.middleware ],
		routers: [ __dirname + '/routes', this.config.dir.server.routes ],
		schemas: [ this.config.dir.server.schemas, __dirname + '/schema.org' ],
		templates: [ __dirname + '/templates', this.config.dir.server.templates ]
	};


	this.loaders = loaders;

	if(!options || options.init !== false) this.init(options);

	return this;
};

Epiphany.prototype.init = function(options) {
	options = options || {};

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

	this.express = require('express');

	this.server = require('./express-setup')(this.config);

	this.prewares = [
		this.mw.static,
		this.mw.bodyParser,
		this.mw.cookieParser,
		this.mw.session
	];

	if(ENV === 'development') {
		this.prewares.unshift(require('morgan')('dev'));
	}

	this.routers = loaders.routers(this.directories.routers, this.express, this.mw, this.config);

	this.postwares = [ this.mw.tcb.responder, this.mw.tcb.errorHandler ];
};


// set ups prewares that won't work in a _pre.js route file.
Epiphany.prototype.setPre = function() {
	this.prewares.forEach(function(mw, i) {
		this.server.use(mw);
	}.bind(this));

	this._pred = true;
};

Epiphany.prototype.initRouters = function(router) {
	if(!this._pred) this.setPre();

	this.routers.forEach(function(arr) {
		this.server.use(arr[0], arr[1]);
	}.bind(this));

	this._routed = true;
};

// set ups postwares that won't work in a _pre.js route file.
Epiphany.prototype.setPost = function() {
	if(!this._routed) this.initRouters();

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
