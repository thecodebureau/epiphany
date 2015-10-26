// set up some globals
global._ = require('lodash');
global.ENV = global.ENV || process.env.NODE_ENV || 'development';
global.PWD = global.PWD || process.env.PWD;

var colorizeStack = require('./util/colorize-stack');

process.on('uncaughtException', function (err) {
	// TODO Node natively seems to get the line and outputs it before the stack
	console.error(colorizeStack(err.stack));
	process.exit(1);
});

var p = require('path');

var appModulePath = require('app-module-path');

// first path is only needed when epiphany has been symlinked (npm link)
appModulePath.addPath(p.join(process.env.PWD, 'node_modules'));
appModulePath.addPath(p.join(process.env.PWD, 'components'));
appModulePath.addPath(p.join(process.env.PWD, 'modules'));
appModulePath.addPath(p.join(p.dirname(__dirname),  'components'));
appModulePath.addPath(p.join(p.dirname(__dirname),  'modules'));

require('./dust-extensions');
require('./mongoose-extensions');

module.exports = require('./epiphany');
