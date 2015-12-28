# Epiphany

## Etymology

Simply due lack of a better name 'Epiphany' was chosen. It has no meaning and is
pretty ambiguous. Sorry.

## Introduction

Epiphany is a library that aims to greatly speed up the creation
of simple websites with Node & Express. Epiphany is
the result of realising the only important thing for an Express
server is its routes. Thus, Epiphany intends to simplify setting up routes.

On top of basic Express setup Epiphany contains predefined middleware that can be
required and used at will. It also contains several schemas for quick
implementation of database models follwing schema.org specifications.

Epiphany is currently intended to be used with:

1. Node & NPM
2. Express
3. MongoDB & Mongoose
4. DustJS templates (from LinkedIn)

## Require paths

In `index.js`, the `/modules` directory in the root project is added (using
[app-module-path](https://www.npmjs.com/package/app-module-path)]) to the array
of paths search for node modules in `require()`. This is to make it easier
to require modules from both Node and Browserify (the same path should thus also
be added to your Browserify/Web-pack config).

## Globals

Epiphany will setup two globals if they are not already set, namely PWD and ENV.

## Initializing

If you want to edit the prewares and/or postwares (or anything else for that
matter) before starting the Express instance, pass `{ start: false }` to the
Epiphany constructor, then call `epiphany.start()` when you are ready.

## Configuration

There is a `/sample-config` directory that contains example configuration files.
These should be copied into your project's `/server/config` directory and edited
to suit your needs.

## Preware & Postware

Preware are middleware functions loaded before the routes, and postware is
loaded after all route specific middleware. Both are path-less, ie they are 
set up simply using

```
express.use([ middleware ]);
```

The prewares and postwares can be edited by manipulating the `epiphany.prewares` and `epiphany.postwares`
arrays respectively. This needs to be done before starting the Epiphany instance.

### Default prewares

```
this.prewares = [
	express.static(this.config.dir.static, ENV === 'production' ? { maxAge: '1 year' } : null),
	express.static(this.config.dir.uploads, ENV === 'production' ? { maxAge: '1 year' } : null),
	bodyParser.json(),
	bodyParser.urlencoded({ extended:true }),
	cookieParser(),
	session(this.config.session)
];
```

### Default postwares

```
this.postwares = [
	require('./middleware/ensure-found'),
	require('./middleware/error-handler'),
	require('./middleware/responder'),
	require('./middleware/responder-error'),
];
```

## Routes

A route is defined by an array with a path, an HTTP/Express method name and a middleware or 
an array of middleware.

Example:

```
var routes = [
	[ '/', 'get', mw.index ],
	[ '/admin', 'get', [ mw.isAuthenticated, mw.admin ]
];
```

These are setup in `epiphany.start()` with

```
var path = arr[0],
	method = arr[1],
	middleware = arr[2];

this.express[method](path, middleware);
```

## Modules

One can use `epiphany.module(module)` to easily extend Epiphany. An Epiphany
module is simply a plain object containing an array of routes, dust filters and/or
dust helpers.

Example module:

```
modul.exports = {
	routes: [
		[ '/ball-sack', 'get', mw.fetchBallSack ]
	],
	filters: {
		camelCase: function(value) {
			return _.camelCase(value);
		}
	},
	helpers: {
		contains: function(chunk, context, bodies, params) {
			return _.contains(params.array, params.value) ? chunk.render(bodies.block, context) : chunk;
		}
	}
};
```

Adding modules should always be done before starting the instance.

## Debugging

Epiphany (and most other server-side modules from TCB) uses the excellent
[Debug](https://github.com/visionmedia/debug) plugin.

To debug everything, simply set `DEBUG=epiphany` as an environment variable. To debug
specific parts, set (for example) `DEBUG=epiphany:loaders`. Debuggable parts are currently:

- epiphany:loaders (template and page loading)
- epiphany:errorhandler
- epiphany:responder

## Example server/server.js

```
// set up some globals (these are also set in Epiphany if not already set)
global.ENV = process.env.NODE_ENV || 'development';
global.PWD = process.env.PWD || process.cwd();

// modules > native
var p = require('path');

// modules > 3rd party
var requireDir = require('require-dir');
var passport = require('passport');

var server = new (require('epiphany'))({
	config: requireDir('./config', { camelcase: true }),

	pages: {
		'/admin': require('./pages-admin'),
		'/': require('./pages-public'),
	},

	routes: require('./routes'),

	modules: [
		require('dust-admin'),

		// hats > hats
		require('hats/membership'),
		require('hats/contact'),
		require('hats/content'),
		require('hats/errors'),
		require('hats/organization'),
		require('hats/news'),
		require('hats/employees'),
		require('hats/image-upload'),
	],

	start: false,
});

// set up passport and membership prewares and postwares
server.prewares.push(passport.initialize(), passport.session());
server.postwares.unshift(require('hats/membership/middleware/authorization').redirectUnauthorized('/login'));

if(ENV === 'development')
	server.prewares.push(require('epiphany/middleware/automatic-login'));

_.extend(server.express.locals, {
	site: require('./config/site'),
	lang: process.env.NODE_LANG || 'en'
});

// set organization from database to express.locals
require('hats/organization/middleware').get(null, { app: server.express }, null);

server.start();
```
