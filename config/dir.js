// MODULES

// modules : NATIVE

var p = require('path');

var PWD = process.env.PWD;

// Server folders. All folder related to the Node server handling most things.
module.exports = {
	// Any code that needs to a "middle landing spot" while built, place it anywhere here
	build: {
		root: p.join(PWD, 'build')
	},

	// public directories. Where all static/built/live content goes.
	public: {
		css: p.join(PWD, 'public', 'css'),
		fonts: p.join(PWD, 'public', 'fonts'),
		img: p.join(PWD, 'public', 'img'),
		root: p.join(PWD, 'public'),
		scripts: p.join(PWD, 'public', 'js')
	},

	root: PWD,

	server: {
		middleware: p.join(PWD, 'server', 'middleware'),
		models: p.join(PWD, 'server', 'models'),
		routes: p.join(PWD, 'server', 'routes'),
		root: p.join(PWD, 'server'),
		schemas: p.join(PWD, 'server', 'schema.org'),
		templates: p.join(PWD, 'server', 'templates'),
		uploads: p.join(PWD, 'server', 'uploads')
	},

	// Source directories. This is where you put all content that needs to be built before use.
	src: {
		fonts: p.join(PWD, 'src', 'fonts'),
		raster: p.join(PWD, 'src', 'raster'),
		root: p.join(PWD, 'src'),
		sass: p.join(PWD, 'src', 'sass'),
		static: p.join(PWD, 'src', 'static'),
		scripts: p.join(PWD, 'src', 'js'),
		svg: p.join(PWD, 'src', 'svg'),
	}
};
