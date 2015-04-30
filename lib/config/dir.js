// MODULES

// modules : NATIVE

var path = require('path');

var PWD = process.env.PWD;

// Server folders. All folder related to the Node server handling most things.
module.exports = {
	// Any code that needs to a "middle landing spot" while built, place it anywhere here
	build: {
		root: path.join(PWD, 'build')
	},

	// public directories. Where all static/built/live content goes.
	public: {
		css: path.join(PWD, 'public', 'css'),
		fonts: path.join(PWD, 'public', 'fonts'),
		img: path.join(PWD, 'public', 'img'),
		root: path.join(PWD, 'public'),
		scripts: path.join(PWD, 'public', 'js')
	},

	server: {
		middleware: path.join(PWD, 'server', 'middleware'),
		models: path.join(PWD, 'server', 'models'),
		routes: path.join(PWD, 'server', 'routes'),
		root: path.join(PWD, 'server'),
		schemas: path.join(PWD, 'server', 'schema.org'),
		templates: path.join(PWD, 'server', 'templates'),
		uploads: path.join(PWD, 'server', 'uploads')
	},

	// Source directories. This is where you put all content that needs to be built before use.
	src: {
		fonts: path.join(PWD, 'src', 'fonts'),
		raster: path.join(PWD, 'src', 'raster'),
		root: path.join(PWD, 'src'),
		sass: path.join(PWD, 'src', 'sass'),
		static: path.join(PWD, 'src', 'static'),
		scripts: path.join(PWD, 'src', 'js'),
		svg: path.join(PWD, 'src', 'svg'),
	}
};
