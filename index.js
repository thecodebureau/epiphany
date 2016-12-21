// force tty
process.stdout.isTTY = true;

// modules > native
var p = require('path');

// set up some globals
global.ENV = global.ENV || process.env.NODE_ENV || 'development';
global.PWD = global.PWD || process.env.NODE_PWD || process.cwd();

var symlinked = __dirname.indexOf(PWD) < 0;

if(symlinked) {
	module.paths.unshift(p.join(PWD, 'node_modules'));
}

var appModulePath = require( 'app-module-path');

if(symlinked)
	// only needed for symlinked modules. such as epiphany itself or hats
	appModulePath.addPath(p.join(PWD, 'node_modules'));

appModulePath.addPath(p.join(PWD, 'modules'));

var colorizeStack = require('./util/colorize-stack');

// make error output stack pretty
process.on('uncaughtException', function (err) {
	// TODO Node natively seems to get the line and outputs it before the stack
	console.error(err.name);
	console.error(err.message);
	console.error(colorizeStack(err.stack));
	process.exit(1);
});

module.exports = require('./epiphany');
