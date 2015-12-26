// modules > native
var fs = require('fs');
var p = require('path');
var url = require('url');

// modules > 3rd-party
var chalk = require('chalk');
var debug = require('debug')('epiphany:loaders');
var dust = require('dustjs-linkedin');

var warningPrefix = '[' + chalk.yellow('!!') + '] ';

var isWin = /^win/.test(process.platform);

var pageMiddleware = require('./middleware/page');
module.exports = {
	templates: function(directory) {
		function recurse(file) {
			if(fs.statSync(file).isDirectory()) {
				_.each(fs.readdirSync(file), function(f) {
					recurse(p.join(file, f)); 
				}); 
			} else if(p.extname(file) === '.dust') {
				var src = fs.readFileSync(file, { encoding: 'utf8' });

				var name = p.relative(directory, file).slice(0,-5);

				if(isWin)
					name = name.split('\\').join('/');

				var compiled;

				try {
					compiled = dust.compile(src, name);
				} catch(e) {
					console.log('error in template: ' + file);
					console.log(e);
					return;
				}

				var dependencies = compiled.match(/\.p\("(.*?)"/g);

				if(dependencies) {
					dependencies = dependencies.map(function(value) {
						return value.slice(4, -1);
					});
				}
				
				if(dust.templates[name]) debug(warningPrefix + 'Overriting template "' + name + '".');

				dust.templates[name] = {
					compiled: compiled,
					dependencies: dependencies
				};

				dust.loadSource(compiled);
			}
		}

		dust.templates = {};

		if(fs.existsSync(directory))
			recurse(directory); 
		else
			throw new Error('Template directory does not exist!');
	},

	pages: function(pageCollections) {
		var navigation = {};
		var routes = [];
		var paths = {};

		_.each(pageCollections, function(pages, key) {
			var rootPath = key === 'public' ? '' : key + '/';

			paths[key] = [];

			var prewares = pages.pre || [];
			var postwares = pages.post || [];

			// recurse loops through all page objects from pages.js and fills in any blanks.
			// it returns all objects that should be available in navigation
			function recurse(pages, tree, nav) {
				_.each(pages, function(page) {

					if(!page.name)
						if(page.title)
							page.name = _.kebabCase(page.title).replace(/[åä]/g, 'a').replace(/ö/g, 'o');
						else if (!page.path)
							throw new Error('Page without name and title!');

					// path will be an array, such as [ 'foo', 'bar' ], not
					// '/foo/bar'... and relative to the key. so
					// /admin/membership/permissions will be [ 'membership', 'permissions' ]
					var path;

					if(page.path) {
						path = _.compact(page.path.split('/'));

						if(!/^\//.test(page.path)) {
							path = tree.concat(path);
						}
					} else {
						path = tree.concat(page.name);
					}

					if(!page.template)
						page.template = rootPath + [ 'pages' ].concat(path).join('/');

					page.path = '/' + rootPath + path.join('/');

					if(!dust.cache[page.template]) {
						page.template = p.join(page.template, 'index');

						if(!dust.cache[page.template]) {
							throw new Error('No template found for page: ' + page.path);
						}
					}

					var middleware = prewares.concat(pageMiddleware(page, navigation[key], nav), page.middleware || [], postwares);

					delete page.middleware;

					routes.push([ page.path, page.method || 'get', middleware ]);

					paths[key].push(page.path);

					// return an object consisting only of the properties required by
					// the navigation templates
					var navItem;

					if(page.nav !== false && nav) {
						nav.push(navItem = _.extend({
							// TODO add this to sprinkles? if so, 'rootPath' needs to be
							// available in the context
							current: function current(chunk, context, bodies, params) {
								var page = context.get('page');

								if(page && page.path) {
									var slice = rootPath.length + 1;

									var currentPath = page.path.slice(slice);

									var path = this.path.slice(slice);
									
									return (!path && !currentPath || path && currentPath.indexOf(path) === 0);
								}
								return false;
							}
						}, _.pick(page, 'name', 'title', 'path', 'description')));
					}

					if(_.isArray(page.pages)) {
						if(page.pages.length === 0)
							delete page.pages;
						else
							recurse(page.pages, path, navItem ? navItem.pages = [] : undefined);
					}

				});
			}

			recurse(pages, [], navigation[key] = []);
		});
		
		return {
			navigation: navigation,
			pages: pageCollections,
			paths: paths,
			routes: routes
		};
	}
};
