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

var Epiphany = function(config) {
	// TODO implement mergin of configs
	var configLocations = [ __dirname + '/config' ];

	if(_.isString(config)) configLocations.push(config);
	else if(!config) configLocations.push(PWD + '/server/config');

	this.config = loaders.config(configLocations);

	if(_.isObject(config)) this.config = _.merge(this.config, config);

	dust.templates = loaders.templates([ __dirname + '/templates', this.config.dir.server.templates ]);

	// load all models into mongoose instance (reachable through require('mongoose').model('ModelName'))
	loaders.models([ __dirname + '/models', this.config.dir.server.models ], [ this.config.dir.server.schemas, __dirname + '/schema.org' ] );

	this.mw = loaders.middleware([ __dirname + '/middleware', this.config.dir.server.middleware ], this.config);

	this.server = require('./express-setup')(this.config);

	this.prewares = [
		express.static(this.config.dir.public.root),
		bodyParser.json(),
		bodyParser.urlencoded({ extended:true }),
		cookieParser(),
		session(this.config.session)
	];

	// delete store object if it exists so middlewares cannot access sessions
	//if(this.config.session.store) delete this.config.session.store;

	if(ENV === 'development') {
		this.prewares.unshift(require('morgan')('dev'));
	}

	this.routers = loaders.routers([ __dirname + '/routes', this.config.dir.server.routes ], this.server, this.mw, this.config);

	this.postwares = [ this.mw.tcb.responder, this.mw.tcb.errorHandler ];

	return this;
};

// set ups prewares that won't work in a _pre.js route file.
Epiphany.prototype.setPre = function() {
	this.prewares.forEach(function(mw) {
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
