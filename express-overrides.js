module.exports = function(server) {
	server.render = function(name, options, fn){
		var opts = {};
		var cache = this.cache;
		var engines = this.engines;
		var view;

		// support callback function as second arg
		if ('function' == typeof options) {
			fn = options;
			options = {};
		}

		// merge app.locals
		_.merge(opts, this.locals);

		// merge options._locals
		if (options._locals) {
			_.merge(opts, options._locals);
		}

		// merge options
		_.merge(opts, options);

		try {
			engines['.dust'](name, opts, fn);
		} catch (err) {
			fn(err);
		}
	};
};
