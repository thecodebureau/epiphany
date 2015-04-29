var dust = require('dustjs-linkedin');

var loaders = require('./loaders');
var Epiphany = function(config) {
	config = config || require('./sample_config/');

	dust.templates = loaders.templates(config.dir.server.templates);
	loaders.models(config.dir.server.models, config.dir.server.schemas);

	this.mw = init.middleware(config.dir.server.middleware, config);
	this.server = require('./express-setup')(config);

	return this;
};


// set ups prewares that won't work in a _pre.js route file.
Epiphany.prototype.prewares = function(middlewares) {
	// global preware
	server.use(mw.tcb.pre);
	server.use(mw.navigation);
};

Epiphany.prototype.routes = function(routers) {};

// set ups postwares that won't work in a _pre.js route file.
Epiphany.prototype.postwares = function(middlewares) {

	// set up postware
	this.server.use(this.mw.tcb.responder);
	this.server.use(this.mw.tcb.errorHandler);
};

Epiphany.prototype.start = function() {
	// start server and let them know it
	server.listen(config.server.port); 
	console.log('Express server started on port %s (%s)', config.server.port, ENV);
};

module.exports = Epiphany;
