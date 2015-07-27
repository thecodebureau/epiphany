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

var isWin = /^win/.test(process.platform);

module.exports = {
	config: function(configs) {
		var collection = {};

		configs.forEach(function(config) {
			if(_.isString(config)) {
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
							console.log(e);
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
					
					if(templates[name]) console.log('WARNING!!! Overriting template "' + name + '".');

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
						schemas[key.toCamelCase()] = val;
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
					console.log(e);
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

	navigation: function(navigations, mw) {
		var collection = {};
		navigations.forEach(function(navigation) {
			if(_.isFunction(navigation))
				navigation = navigation(mw);

			_.each(navigation, function(routes, key) {
				if(key !== 'redirects') {
					(function recurse(routes, tree) {
						tree = tree || [];
						_.map(routes, function(route) {

							if(!route.name)
								if(route.title)
									route.name = route.title.toSpinalCase().replace(/[åä]/g, 'a').replace(/ö/g, 'o').toSpinalCase();
								else if (!route.path)
									throw new Error('Route without name, title and path!');

							var path = route.path ? _.compact(route.path.split('/')) : tree.concat(route.name);

							if(!route.path) 
								route.path = '/' + path.join('/');

							if(route.view === true || route.view === 1)
								route.view = route.title;

							if(route.nav !== false)
								route.nav = true;

							if(!route.template)
								route.template = (key === 'admin' ? key + '/' : '') + 'pages/' + path.join('/');
							else if(/^:l/.test(route.template))
								route.template = 'admin/pages/landing';

							if(!dust.cache[route.template]) {
								route.template = p.join(route.template, 'index');
								if(!dust.cache[route.template]) {
									throw new Error('No template found for route: ' + route.path);
								}
							}

							if(_.isArray(route.sub))
								recurse(route.sub, path);

							return route;
						});
					})(routes);
					collection[key] = routes;
				}
			});
		});
		
		return collection;
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
				if(obj[key]) console.log('WARNING!!! Overrwriting "' + key + '" middleware');

				obj[key] = module;
			});
		}

		var mw = {};

		if(!_.isArray(items)) items = [ items ];

		items.forEach(function(item) {
			if(_.isString(item))
				item = requireDir(item, { recurse: true });

			recurse(item, mw);
		});

		return mw;
	},

	routes: function(items, mw, epiphany) {
		// TODO check if overriting routers
		function recurse(obj, tree) {
			_.each(obj, function(value, key) {
				if(_.isFunction(value)) {
					var routes = value(mw, epiphany);

					var arr = _.compact(routes.root ? routes.root.split('/') : /^_/.test(key) ? tree : tree.slice(0).concat(key));

					var preware = [];

					if(routes.before) preware = preware.concat(routes.before);

					var postware = [];

					if(routes.after) postware = postware.concat(routes.after);

					if(routes.routes) routes = routes.routes;

					routes.forEach(function(route) {
						function addRoute(str) {
							var path = '/' + (str ? arr.concat(_.compact(str.split('/'))) : arr).join('/');

							if(isWin)
								path = p.split('\\').join('/');

							if(!collection[path]) collection[path] = {};

							if(collection[path][method])
								console.log('WARNING!!! Overrwriting route: "' + method.toUpperCase() + ': ' + path + '.');

							collection[path][method] = mw;
						}

						var method = route[0];

						var mw = _.compact(preware.concat(route[2], postware));

						if(mw.length === 1) mw = mw[0];

						if(_.isArray(route[1])) route[1].forEach(addRoute);
						else addRoute(route[1]);
					});
				} else {
					recurse(value, tree.concat(key));
				}
			});
		}

		var collection = {};

		if(!_.isArray(items)) items = [ items ];

		items.forEach(function(item) {
			if(_.isString(item)) 
				item = requireDir(item, { recurse: true });

			recurse(item, []);
		});

		collection = _.object(_.sortBy(_.pairs(collection), function(pair) { 
			// make : & * routes be placed behind all the others.
			return pair[0].split(':').join('zzzy').split('*').join('zzzz');
		}));

		return collection;
	},
};
