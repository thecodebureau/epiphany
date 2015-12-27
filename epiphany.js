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
var loadTemplates = require('./load-templates');
var loadPages = require('./load-pages');
var logError = require('./util/log-error');

// extend dust and mongoose
require('./dust-extensions');


var Epiphany = function(options) {
	options = options || {};

	// load configuration
	this.config = _.merge(requireDir(p.join(PWD, '/server/config'), { camelcase: true }), options.config );

	// connect to mongodb
	mongoose.connect(this.config.mongo.uri, _.omit(this.config.mongo, 'uri'));

	// setup express
	this.express = require('./express-setup')(this.config);

	this.middleware = _.merge({
		static: express.static(this.config.dir.static, ENV === 'production' ? { maxAge: '1 year' } : null),
		uploads: express.static(this.config.dir.uploads, ENV === 'production' ? { maxAge: '1 year' } : null),
		bodyParser: [ bodyParser.json(), bodyParser.urlencoded({ extended:true }) ],
		cookieParser: cookieParser(),
		session: session(this.config.session)
	}, requireDir('./middleware', { camelcase: true }));

	// set up default prewares
	this.prewares = [
		this.middleware.static,
		this.middleware.uploads,
		this.middleware.bodyParser,
		this.middleware.cookieParser,
		this.middleware.session
	];

	// TODO should this be active in staging?
	if(ENV !== 'production') {
		this.prewares.unshift(require('morgan')('dev'));
	}

	// set up default postwares
	this.postwares = [
		this.middleware.ensureFound,
		// transform and log error
		this.middleware.errorHandler,
		// respond
		this.middleware.responder,
		// handle error rendering error
		this.middleware.responderError
	];

	loadTemplates(this.config.dir.templates);

	this.routes = require('./routes');

	_.each([ options ].concat(options.modules), function(module) {
		this.module(module);
	}, this);

	var obj = loadPages(options.pages);

	this.routes = this.routes.concat(obj.routes);

	_.merge(this, _.omit(obj, 'routes'));
	_.merge(this.express, _.omit(obj, 'routes'));

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
	var props = [
		'models',
		'middleware',
		'routes',
	];

	_.each(_.pick(module, props), function(value, key) {
		if(_.isArray(this[key]))
			this[key] = this[key].concat(value);
		else
			_.extend(this[key], value);
	}, this);

	_.merge(dust, _.pick(module, 'filters', 'helpers'));
};

Epiphany.prototype.start = function() {
	this.express.locals.lang = process.env.NODE_LANG || 'en';

	var jsFile = p.join(PWD, 'public/js.json');

	if(fs.existsSync(jsFile))
		this.express.locals.js = require(jsFile);

	var cssFile = p.join(PWD, 'public/css.json');

	if(fs.existsSync(cssFile))
		this.express.locals.css = require(cssFile);

	this.prewares.forEach(function(middleware, i) {
		if(_.isArray(middleware) && _.isString(middleware[0]))
			this.express.use(middleware[0], middleware[1]);
		else
			this.express.use(middleware);

	}, this);

	_.each(this.routes, function(arr) {
		var path = arr[0],
			method = arr[1],
			middleware = arr[2];

		if(!_.isFunction(middleware) && (_.isEmpty(middleware) || _.some(middleware, function(value) { return !_.isFunction(value); }))) {
			throw new Error('Undefined or non-function as middleware for [' + method + ']:' + path);
		}

		this.express[method](path, middleware);
	}, this);

	// initialize postwares (from old setPost)
	this.postwares.forEach(function(middleware) {
		this.express.use(middleware);
	}, this);

	// start server and let them know it
	this.express.listen(this.config.port); 

	console.info('Express server started on port %s (%s)', this.config.port, ENV);
};

module.exports = Epiphany;
