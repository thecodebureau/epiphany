// EXPRESS
var dust = require('dustjs-linked');
var express = require('express');
var dust = require('dustjs-linkedin');
var bodyParser = require('body-parser');
var session = require('express-session');
var cookieParser = require('cookie-parser');

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
	// minifying is done by html-minifier in intializers.js, so we
	// don't have to worry about whitespaces
	if(ENV !== 'production')
		dust.config.whitespace = true;

	if(ENV === 'development') {
		var morgan = require('morgan');
		server.use(morgan('dev'));
	}

	// preware > static
	server.use(express.static(config.dir.public.root));

	server.use(bodyParser.json());
	server.use(bodyParser.urlencoded({ extended:true }));
	server.use(cookieParser());

	// set up session. use Redis database for session storage if not in development
	if (config.server.session.redis) {
		var RedisStore = require('connect-redis')(session);

		var redisStore = new RedisStore(config.server.session.redis);
		redisStore.on('connect', function(){
			console.log("Redis connected succcessfully"); });
		redisStore.on('disconnect', function(){
			console.error("Unable to connect to redis. Has it been started?"); });
		config.server.session.store = redisStore; }

	server.use(session(config.server.session));
};
