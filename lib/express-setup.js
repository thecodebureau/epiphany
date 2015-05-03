// EXPRESS
var express = require('express');
var dust = require('dustjs-linkedin');

var server = express();

require('./express-overrides')(server);

module.exports = function(config) {
	// set up dust templating
	server.engine('dust', function(name, options, fn) {
		dust.render(name, options, fn);
	});
	server.set('view engine', 'dust');
	server.set('views', config.dir.src.templates);

	// preserve whitespaces development mode. in production mode, most
	// minifying is done by html-minifier in loaders.js, so we
	// don't have to worry about whitespaces
	if(ENV !== 'production')
		dust.config.whitespace = true;

	return server;
};