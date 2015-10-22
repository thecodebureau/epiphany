// MODULES

// modules > native
var fs = require('fs');
var p = require('path');
var url = require('url');

// modules > 3rd-party
var _ = require('lodash');
var dust = require('dustjs-linkedin');
var mongoose = require('mongoose');
var requireDir = require('require-dir');
var minify = require('html-minifier').minify;
var chalk = require('chalk');
var debug = require('debug')('epiphany:loaders');

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

					if(ENV === 'production') {
						var regexp = /{[\/?+:#><]?[^}]*}/g;
						var matches = src.match(regexp) || [];
						src = src.split(regexp).join('aaaaaaaaaaaa');
						src = minify(src, { collapseWhitespace: true });
						

						var arr = src.split('aaaaaaaaaaaa');
						src = '';
						for (var i = 0; i < arr.length; i++) {
							src = src + arr[i] + (matches[i] ? matches[i] : '');
						}
					}

					var name = p.relative(directory, file).slice(0,-5);

					if(isWin)
						name = name.split('\\').join('/');

					var compiled = dust.compile(src, name);
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

	mongoose: function(modelDirectories, pluginDirectories, schemaDirectories) {
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
					arr[1](mongoose, schemas, plugins);
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

	pages: function(items, epiphany) {
		var navigation = {};
		var routes = [];
		var paths = {};

		items.forEach(function(item) {
			if(_.isFunction(item))
				item = item(epiphany.mw, epiphany);

			_.each(item, function(pages, key) {
				function current(chunk, context, bodies, params) {
					var page = context.get('page');

					if(page && page.path) {
						var slice = rootPath.length + 1;

						var currentPath = page.path.slice(slice);

						var path = this.path.slice(slice);
						
						return (!path && !currentPath || path && currentPath.indexOf(path) === 0);
					}
					return false;
				}

				if(key === 'redirects') {
					pages.forEach(function(arr) {
						routes.push('get', arr[0], function redirect(req, res) {
							res.redirect(arr[1]);
						});
					});
				} else {
					paths[key] = [];
					var rootPath = key === 'public' ? '' : key + '/';

					var recurse = function(pages, tree) {
						return _.compact(_.map(pages, function(page) {

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

							paths[key].push(page.path);

							if(!dust.cache[page.template]) {
								page.template = p.join(page.template, 'index');
								if(!dust.cache[page.template]) {
									throw new Error('No template found for page: ' + page.path);
								}
							}

							if(_.isArray(page.pages)) {
								page.pages = recurse(page.pages, path);

								if(page.pages.length === 0)
									delete page.pages;
							}

							var pageClone = _.clone(page);

							page.mw = _.compact([ function pg(req, res, next) {
								res.locals.page = pageClone;
								res.locals.page.path = req.path;
								res.locals.navigation = epiphany.navigation[key];
								res.locals.template = page.template;
								next();
							} ].concat(page.mw));

							// TODO has side effect > not functional
							routes.push([ page.method || 'get', page.path, page.mw ]);

							page.current = current;

							return page.nav === false ? undefined : _.clone(page);
						}));
					};

					var nav = recurse(pages, []);
					navigation[key] = nav;
				}
			});
		});
		
		return {
			routes: routes,
			navigation: navigation,
			paths: paths
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
