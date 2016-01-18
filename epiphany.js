// modules > native
var fs = require('fs');
var p = require('path');

// modules > 3rd party
var dust = require('dustjs-linkedin');
var chalk = require('chalk');
var express = require('express');
var mongoose = require('mongoose');

// modules > express middlewares
var bodyParser = require('body-parser');
var session = require('express-session');
var cookieParser = require('cookie-parser');

// modules > internal
var loadTemplates = require('./load-templates');
var loadPages = require('./load-pages');

// extend dust
require('./dust-extensions');

var Epiphany = function(options) {
	this.config = options.config;

	// setup express
	this.express = require('./express-setup');

	// set up default prewares
	this.prewares = [
		express.static(this.config.dir.static, ENV === 'production' ? { maxAge: '1 year' } : null),
		express.static(this.config.dir.uploads, ENV === 'production' ? { maxAge: '1 year' } : null),
		bodyParser.json(),
		bodyParser.urlencoded({ extended:true }),
		cookieParser(),
		session(this.config.session)
	];

	// TODO should this be active in staging?
	if(ENV !== 'production') {
		this.prewares.unshift(require('morgan')('dev'));
	}

	// set up default postwares
	this.postwares = [
		require('./middleware/ensure-found'),
		// transform and log error
		require('./middleware/error-handler'),
		// respond
		require('./middleware/responder'),
		// handle error rendering error
		require('./middleware/responder-error'),
	];

	loadTemplates(this.config.dir.templates);

	this.routes = [
		[ '/templates/*', 'get', require('./middleware/templates') ]
	];

	_.each([ options ].concat(options.modules), this.module.bind(this));

	_.merge(this, loadPages(options.pages), function(a, b) {
		if (_.isArray(a)) {
			return a.concat(b);
		}
	});

	/* paths on express instance below is currently only used by hats/content
	 * paths middleware.
	 */
	_.merge(this.express, _.pick(this, 'paths'));

	if(options.start !== false) this.start();

	return this;
};

Epiphany.prototype.module = function(module, last) {
	if(module.routes)
		this.routes = this.routes.concat(module.routes);

	_.merge(dust, _.pick(module, 'filters', 'helpers'));
};

Epiphany.prototype.start = function() {
	var self = this;

	this.prewares.forEach(function(middleware, i) {
		if(_.isArray(middleware) && _.isString(middleware[0]))
			self.express.use(middleware[0], middleware[1]);
		else
			self.express.use(middleware);
	});

	_.each(this.routes, function(arr) {
		var path = arr[0],
			method = arr[1],
			middleware = arr[2];

		if(!_.isFunction(middleware) && (_.isEmpty(middleware) || _.some(middleware, function(value) { return !_.isFunction(value); }))) {
			throw new Error('Undefined or non-function as middleware for [' + method + ']:' + path);
		}

		self.express[method](path, middleware);
	});

	// initialize postwares (from old setPost)
	this.postwares.forEach(function(middleware) {
		self.express.use(middleware);
	});

	// connect to mongodb
	mongoose.connect(this.config.mongo.uri, _.omit(this.config.mongo, 'uri'));

	// start server and let them know it
	this.express.listen(this.config.port, function() {
		console.info('Express server started on port %s (%s)', self.config.port, ENV);
	});
};

module.exports = Epiphany;
