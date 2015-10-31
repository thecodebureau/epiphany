// modules > native
var p = require('path');

// set up some globals
global.ENV = global.ENV || process.env.NODE_ENV || 'development';
global.PWD = global.PWD || process.env.PWD || process.cwd();

// if symlinked we need to add PWD/node_modules to paths
// so we can require app-module paths
if(__dirname.indexOf(PWD) < 0) {
	module.paths.unshift(p.join(process.env.PWD, 'node_modules'));
}

var appModulePath = require( 'app-module-path');

if(ENV !== 'production')
	// only needed for symlinked modules. such as epiphany itself or hats
	appModulePath.addPath(p.join(process.env.PWD, 'node_modules'));

appModulePath.addPath(p.join(process.env.PWD, 'modules'));

// make lodash global
global._ = require('lodash');

var colorizeStack = require('./util/colorize-stack');

// make error output stack pretty
process.on('uncaughtException', function (err) {
	// TODO Node natively seems to get the line and outputs it before the stack
	console.error(colorizeStack(err.stack));
	process.exit(1);
});

module.exports = require('./epiphany');
