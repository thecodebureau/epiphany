// modules > native
var fs = require('fs');
var p = require('path');
var url = require('url');

// modules > 3rd-party
var chalk = require('chalk');
var debug = require('debug')('epiphany:loaders');
var dust = require('dustjs-linkedin');
var mongoose = require('mongoose');
var requireDir = require('require-dir');

var isWin = /^win/.test(process.platform);

var warningPrefix = '[' + chalk.yellow('!!') + '] ';

module.exports = {
	config: function(configs) {
		var collection = {};

		configs.forEach(function(config) {
			if(_.isString(config)) {
				if(!fs.existsSync(config))
					return;

				config = _.mapKeys(requireDir(config, { recurse: true }), function(value, key) {
					return _.camelCase(key);
				});
			}

			if (!_.isObject(config)) {
				throw new Error('Config item is not an object: ' + config);
			}

			var pairs = _.pairs(config);
			var length;

			while((length = pairs.length) > 0) {
				pairs = pairs.filter(function (arr) {
					var key = arr[0],
						value = arr[1];

					if(_.isFunction(value)) {
						try {
							if(key === 'globals') {
								value(global);
								return false;
							} else
								value = value(collection);
						} catch(e) {
							// TODO maybe enable debugging
							debug(e.name + ': ' + e.message);
							return true;
						}
					}

					if(_.some(_.keys(_.pick(value, [ 'defaults', 'development', 'stagin', 'production' ])))) {
						if(_.isObject(_.find(value))) 
							value = _.merge(value.defaults, value[ENV]);
						else
							value = value[ENV];
					}

					if(value === undefined || _.isObject(value) && _.isEmpty(value))
						throw new Error('Undefined or empty object returned for config property: ' + key);

					var obj = {};
					obj[key] = value;

					_.merge(collection, obj); 

					return false;
				});

				if(pairs.length === length) {
					throw new Error('Circular references in config, keys left: ' + pairs.map(function(pair) { return pair[0]; }).join(', '));
				}
			}
		});

		return collection;
	},

	templates: function(directories) {
		var templates = {};

		if(_.isString(directories)) directories = [ directories ];

		directories.forEach(function(directory) {
			function recurse( file) {
				file = file || root;
				if(fs.statSync(file).isDirectory()) {
					_.each(fs.readdirSync(file), function(f) {
						recurse(p.join(file, f)); 
					}); 
				} else if(p.extname(file) === '.dust') {
					var src = fs.readFileSync(file, { encoding: 'utf8' });

					var name = p.relative(directory, file).slice(0,-5);

					if(isWin)
						name = name.split('\\').join('/');

					try {
						var compiled = dust.compile(src, name);
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
					
					if(templates[name]) debug(warningPrefix + 'Overriting template "' + name + '".');

					templates[name] = {
						compiled: compiled,
						dependencies: dependencies
					};
				}
			}

			if(fs.existsSync(directory))
				recurse(directory); 
		});

		_.each(templates, function(template) {
			dust.loadSource(template.compiled);
		});

		return templates;
	},

	mongoose: function(modelDirectories, pluginDirectories, schemaDirectories, epiphany) {
		// Save base schema, which should be used for all
		// data base models.
		var schemas = {};

		if(schemaDirectories) {
			if(!_.isArray(schemaDirectories)) schemaDirectories = [ schemaDirectories ];

			schemaDirectories.forEach(function(directory) {
				if(fs.existsSync(directory)) {
					// Save schemas as array of arrays, inner arrays containing
					// the name of the Schema (which is the file name in pascal case)
					// and the function that returns the schema
					_.each(requireDir(directory, { recurse: true }), function(val, key) {
						schemas[_.camelCase(key)] = val;
					});
				}
			});
		}

		var plugins = {};

		if(pluginDirectories) {
			if(!_.isArray(pluginDirectories)) pluginDirectories = [ pluginDirectories ];

			pluginDirectories.forEach(function(directory) {
				if(fs.existsSync(directory)) {
					_.extend(plugins, _.object(_.pairs(requireDir(directory, { recurse: true })).map(function(val) {
						if(val.indexOf('-') > -1)
							val[0] = val[0].toPascalCase();

						val[1] = val[1](mongoose, schemas);

						return val;
					})));
				}
			});
		}

		if(!_.isArray(modelDirectories)) modelDirectories = [ modelDirectories ];

		var models = {};

		modelDirectories.forEach(function(directory) {
			if(fs.existsSync(directory)) {
				// all model files MUST return a function that takes the schemas
				// object as a parameter.

				// Save all of these functions to array
				_.extend(models, requireDir(directory, { recurse: true }));

			}
		});

		models = _.pairs(models);

		var length = length;

		// Loop until all models have been initialized
		while((length = models.length) > 0) {
			models = models.filter(function run(arr) {
				try {
					arr[1](mongoose, schemas, plugins, epiphany);
				} catch(e) {
					// TODO maybe enable debugging

					debug(e);
					// TODO overwrite previously compiled models
					// return true so failed function stays in model array
					return true;
				}

				// return false to delete function from array
				return false;
			});

			// if models are same length after on iteration unresolved errors
			// have been caused. most likely to circular reference of models.
			if(models.length === length) {
				// TODO print out models that are left
				throw new Error('Circular reference in Mongoose Models. Models left:' + models.map(function(val) { return val[0]; }).join(', '));
			}
		}
	},

	pages: function(pageItems, epiphany) {
		var navigation = {};
		var routes = [];
		var allPages = {};


		pageItems.forEach(function(item) {
			if(_.isFunction(item))
				item = item(epiphany.mw, epiphany);

			_.each(item, function(pages, key) {
				if(key === 'redirects') {
					pages.forEach(function(arr) {
						routes.push('get', arr[0], function redirect(req, res) {
							res.redirect(arr[1]);
						});
					});
				} else {
					allPages[key] = pages;
					var rootPath = key === 'public' ? '' : key + '/';

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
									throw new Error('page without name, title and path!');

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

							if(page.view === true)
								page.view = page.title;

							if(!page.template)
								page.template = rootPath + [ 'pages' ].concat(path).join('/');

							page.path = '/' + rootPath + path.join('/');

							if(!dust.cache[page.template]) {
								page.template = p.join(page.template, 'index');

								if(!dust.cache[page.template]) {
									throw new Error('No template found for page: ' + page.path);
								}
							}

							var mw = _.compact(prewares.concat(function pg(req, res, next) {
								// we need routePath mainly so that we can use ie news/:id to set content in hats/content
								var pageClone = _.clone(page);
								pageClone.routePath = pageClone.path;
								pageClone.path = req.path;
								res.locals.page = pageClone;
								res.locals.navigation = epiphany.navigation[key];
								res.locals.template = pageClone.template;

								next();
							}, page.mw, postwares));

							delete page.mw;

							routes.push([ page.method || 'get', page.path, mw ]);

							// return an object consisting only of the properties required by
							// the navigation templates
							var navObject;
							if(page.nav !== false && nav) {
								nav.push(navObject = _.extend({
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
									recurse(page.pages, path, navObject ? _.last(nav).pages = [] : undefined);
							}

						});
					}

					recurse(pages, [], navigation[key] = []);
				}
			});
		});
		
		return {
			routes: routes,
			navigation: navigation,
			pages: allPages
		};
	},

	middleware: function(items, config) {
		function recurse(modules, obj) {
			modules = _.mapKeys(modules , function(value, key) {
				return _.camelCase(key);
			});

			_.each(modules, function(module, key) {

				// TODO handle overwriting single middleware object with multiple and vice versa
				if(_.isFunction(module)) {
					var str = module.toString();

					if(module.length === 0 || str.substr(str.indexOf('(') + 1,3) === 'con')
						module = module(config, mongoose, mw);
				}
				
				if(!_.isFunction(module) && !_.isArray(module) && _.isObject(module)) {
					if(!obj[key]) obj[key] = {};

					return recurse(module, obj[key]);
				}

				// TODO show entire namespace of overwritten middleware
				// TODO show what location, item is overwriting what
				if(obj[key]) debug(warningPrefix + 'Overrwriting "' + key + '" middleware');

				obj[key] = module;
			});
		}

		var mw = {};

		if(!_.isArray(items)) items = [ items ];

		items.forEach(function(item) {
			if(_.isString(item)) {
				if(!fs.existsSync(item))
					return;

				item = requireDir(item, { recurse: true });
			}

			recurse(item, mw);
		});

		return mw;
	},

	routes: function(items, mw, epiphany) {
		function recurse(routes, tree) {
			if(_.isFunction(routes)) {
				routes = routes(mw, epiphany);
			}
			
			if(!_.isArray(routes)) {
				return _.each(routes, function(routes, key) {
					recurse(routes, /^_/.test(key) ? tree : tree.concat(key));
				});
			}

			routes.forEach(function(route) {
				var method = route[0],
					path = route[1],
					mw = route[2];
				
				path =  [ '' ].concat(tree).join('/') + path;

				if(isWin)
					path = p.split('\\').join('/');

				if(_.isArray(mw) && mw.length === 1) mw = mw[0];

				if(!collection[path]) collection[path] = {};

				if(collection[path][method])
					debug(warningPrefix + 'Overrwriting route: "' + method.toUpperCase() + ': ' + path + '.');

				collection[path][method] = mw;
			});
		}

		var collection = {};

		if(!_.isArray(items)) items = [ items ];

		items.forEach(function(item) {
			if(_.isString(item)) {
				if(!fs.existsSync(item))
					return;

				item = requireDir(item, { recurse: true });
			}

			recurse(item, []);
		});

		return collection;
	},
};
