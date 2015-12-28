// modules > 3rd party
var _ = require('lodash');
var dust = require('dustjs-linkedin');

var server = require('express')();

/* prevent express from looking up the view in the file system
 * since we are using dust.cache (dust.cache should be populated
 * in load-templates.js).
 */
server.get('view').prototype.lookup = function(name) {
	// remove extension
	name = name.replace(/\..*$/, '');

	return dust.cache[name] ? name : undefined;
};

server.engine('dust', function(name, options, fn) {
	dust.render(name, _.omit(options, 'settings', '_locals'), fn);
});

server.set('view engine', 'dust');

/* Templates are compiled and cached on startup,
 * so always let Express do its caching as well
 */
server.set('view cache', true);

// cannot remember what this is for
if(ENV === 'development')
	server.set('trust proxy', true);

/* Dust dust very bad minifying, mercilessly concatting different
 * text rows, so we need to set conserve whitespaces.
 */
dust.config.whitespace = true;

module.exports = server;
