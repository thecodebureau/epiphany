var p = require('path');

module.exports = {
	middleware: p.join(PWD, 'server', 'middleware'),
	models: p.join(PWD, 'server', 'models'),
	routes: p.join(PWD, 'server', 'routes'),
	root: p.join(PWD, 'server'),
	schemas: p.join(PWD, 'server', 'schema.org'),
	static: p.join(PWD, 'public'),
	templates: p.join(PWD, 'public', 'uncompiled-templates'),
	uploads: p.join(PWD, 'uploads')
};
