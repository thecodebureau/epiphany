var dust = require('dustjs-linkedin');
var mongoose = require('mongoose');

var loaders = require('./loaders');

var Epiphany = function(config) {
	this.config = config || require('../sample_config/');

	dust.templates = loaders.templates(this.config.dir.server.templates);
	loaders.models(this.config.dir.server.models, this.config.dir.server.schemas);

	this.mw = loaders.middleware([ __dirname + '/middleware', this.config.dir.server.middleware ], this.config);
	this.server = require('./express-setup')(this.config);

	return this;
};

// set ups prewares that won't work in a _pre.js route file.
Epiphany.prototype.prewares = function(middlewares) {
	// global preware
	//this.server.use(this.mw.tcb.pre);
	//this.server.use(this.mw.navigation);
};

Epiphany.prototype.routes = function(routers) {
	// initialise routes
	loaders.routes(this.config.dir.server.routes, this.server, this.mw, this.config);
};

// set ups postwares that won't work in a _pre.js route file.
Epiphany.prototype.postwares = function(middlewares) {
	// set up postware
	this.server.use(this.mw.tcb.responder);
	this.server.use(this.mw.tcb.errorHandler);
};

Epiphany.prototype.start = function() {
	// start server and let them know it
	// connect to mongodb
	mongoose.connect(config.server.mongo.uri, config.server.mongo.options);

	this.server.listen(this.config.server.port); 
	console.log('Express server started on port %s (%s)', this.config.server.port, ENV);
};

module.exports = Epiphany;
