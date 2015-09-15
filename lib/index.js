var p = require('path');

var appModulePath = require('app-module-path');

// first path is only needed when epiphany has been symlinked (npm link)
appModulePath.addPath(p.join(process.env.PWD, 'node_modules'));
appModulePath.addPath(p.join(process.env.PWD, 'components'));
appModulePath.addPath(p.join(process.env.PWD, 'modules'));
appModulePath.addPath(p.join(p.dirname(__dirname),  'components'));
appModulePath.addPath(p.join(p.dirname(__dirname),  'modules'));

require('poirot');
require('./dust-extensions');
require('./mongoose-extensions');

module.exports = require('./epiphany');
