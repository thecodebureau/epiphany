var chalk = require('chalk');

var redisStore;

var config = {
	secret: 'change-this-fool',
	resave: true,
	saveUninitialized: true
};

var redisConfig = {
	host: 'localhost',
	port: 6379
};

if(ENV === 'production') {
	var RedisStore = require('connect-redis')(require('express-session'));

	redisStore = new RedisStore(this.redis);

	redisStore.on('connect', function(){
		console.info("Redis connected succcessfully");
	});

	redisStore.on('disconnect', function(){
		console.error("[" + chalk.red('ERROR') + "]  Unable to connect to redis. Has it been started?"); 
		process.exit(2);
	});

	config.store = redisStore;
}

module.exports = config;
