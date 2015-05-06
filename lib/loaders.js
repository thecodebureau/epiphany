// MODULES

// modules > native
var fs = require('fs');
var path = require('path');
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
		if(!_.isArray(configs)) configs = [ configs ];

		// remap all keys to be in camelCase. requireDir has the camelcase option,
		// but the current version leaves the old, non-camelcase property on the object.
		configs = configs.map(function(config) {
			function toCamelCase(obj) {
				return _.object(_.pairs(obj).map(function(pair) {
					if(pair[0].indexOf('-') > -1)
						pair[0] = pair[0].toCamelCase();

					return pair;
				}));
			}

			return _.isObject(config) ? config : toCamelCase(requireDir(config, { recurse: true }))
		});

		// collect a (unique) list of all keys from all config objects
		var keys = configs.reduce(function(prev, next) {
			return _.union(prev, _.keys(next));
		}, []);

		// initialise config object to be returned;
		var configObject = {};

		var length;

		// loop until all keys have been processed, and thus removed.
		// infinite loops are prevented by throwing error if one loop does
		// not change length of keys array.
		while((length = keys.length) > 0) {
			keys.forEach(function(key, i) {
				var result = [];

				var done = configs.every(function propertyCollector(config) {
					var propertyValue = config[key];

					if(propertyValue === undefined) return true;

					if(key === 'globals') {
						propertyValue(global);
						delete config[key];
					} else if(_.isFunction(propertyValue)) {
						try {
							propertyValue = propertyValue(configObject);

							return propertyCollector(_.object([ key ], [ propertyValue ]));
						} catch(e) {
							return false;
						}
					} else if (_.isObject(propertyValue) && propertyValue.defaults) {
						propertyValue = _.merge(propertyValue.defaults, propertyValue[ENV]);
					}

					if(_.isObject(propertyValue) && !_.isFunction(propertyValue)) {
						if(result.push) result.push(propertyValue);
						else result = [ propertyValue ];
					} else {
						result = propertyValue;
					}

					return true;
				});

				// if all configs have been treated, save result
				if(done) {
					if(_.isArray(result))
						result = _.merge.apply(null, result);

					configObject[key] = result;

					configs.forEach(function(config) {
						delete config[key];
					});

					keys.splice(i, 1);
				}
			});

			if(keys.length === length) {
				throw new Error('Circular references in config');
			}
		}

		console.log(configObject);

		return configObject;
	},

	templates: function(directories) {
		var obj = {};

		if(_.isString(directories)) directories = [ directories ];

		directories.forEach(function(directory) {
			function recurse( file) {
				file = file || root;
				if(fs.statSync(file).isDirectory()) {
					_.each(fs.readdirSync(file), function(f) {
						recurse(path.join(file, f)); 
					}); 
				} else if(path.extname(file) === '.dust') {
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

					var name = path.relative(directory, file).slice(0,-5);

					if(isWin)
						name = name.split('\\').join('/');

					var compiled = dust.compile(src, name);

					var dependencies = compiled.match(/\.p\("(.*?)"/g);
					if(dependencies) {
						dependencies = dependencies.map(function(value) {
							return value.slice(4, -1);
						});
					}
					if(obj[name]) console.log('WARNING!!! Overriting template "' + name + '".');
					obj[name] = {
						src: src,
						compiled: compiled,
						dependencies: dependencies
					};
				}
			}

			if(fs.existsSync(directory))
				recurse(directory); 
		});

		_.each(obj, function(template) {
			dust.loadSource(template.compiled);
		});

		return obj;
	},

	models: function(modelDirectories, schemaDirectories) {
		var length;

		// Save base schema, which should be used for all
		// data base models.
		var schemas = {
			Base: new mongoose.Schema({
				dateCreated: { type: Date, default: Date.now },
				dateModified: Date,
				datePublished: Date
			})
		};

		if(schemaDirectories) {
			if(!_.isArray(schemaDirectories)) schemaDirectories = [ schemaDirectories ];

			schemaDirectories.forEach(function(directory) {
				if(fs.existsSync(directory)) {
					// Save schemas as array of arrays, inner arrays containing
					// the name of the Schema (which is the file name in pascal case)
					// and the function that returns the schema
					var pairs = _.pairs(requireDir(directory, { recurse: true })).map(function(val) {
						val[0] = val[0].toPascalCase();
						return val;
					});

					// loop while there are still Schemas that haven't initialized
					while(pairs.length > 0) {
						length = pairs.length;

						pairs = pairs.filter(function(arr) {
							// try calling the function with the schemas object.
							// if it fails it will be because an extended schema
							// has not been initialized yet (unless the file has a
							// bug in it)
							try {
								schemas[arr[0]] = arr[1](mongoose, schemas);
							} catch(e) {
								// return true so that the Schema array is left in schemaArrays array
								return true;
							}
							// no error, the schema is successfully loaded, so return false
							// and filter it out of the pairs array
							return false;
						});

						if(pairs.length === length) 
							throw new Error('Circular reference in Mongoose Schemas.');
					}
				}
			});
		}

		if(!_.isArray(modelDirectories)) modelDirectories = [ modelDirectories ];

		modelDirectories.forEach(function(directory) {
			if(fs.existsSync(directory)) {
				// all model files MUST return a function that takes the schemas
				// object as a parameter.

				// Save all of these functions to array
				var models = _.values(requireDir(directory, { recurse: true }));

				// Loop until all models have been initialized
				while(models.length > 0) {
					length = models.length;

					models = models.filter(function run(fnc) {
						try {
							fnc(mongoose, schemas);
						} catch(e) {
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
						throw new Error('Circular reference in Mongoose Models.');
					}
				}
			}
		});
	},

	middleware: function(directories, config) {
		function recurse(modules, obj) {
			_.each(modules, function(module, name) {
				var camelCase = name.indexOf('-') > -1 ? name.toCamelCase() : name;

				if(_.isFunction(module)) {
					if(obj[camelCase]) console.log('WARNING!!! Overrwriting "' + camelCase + '" middleware');

					obj[camelCase] = module(config, mongoose);
				} else {
					if(!obj[camelCase]) obj[camelCase] = {};

					recurse(module, obj[camelCase]);
				}

				if(camelCase !== name) delete obj[name];
			});
		}

		var mw = {};

		if(!_.isArray(directories)) directories = [ directories ];

		directories.forEach(function(directory) {
			if(fs.existsSync(directory)) {
				recurse(requireDir(directory, { recurse: true }), mw);
			}
		});

		return mw;
	},

	routes: function(directories, express, mw, config) {
		// TODO check if overriting routers
		function recurse(obj, tree) {
			_.each(obj, function(value, key) {
				if(_.isFunction(value)) {
					var routes = value(mw, config, express);

					var arr = _.compact(routes.root ? routes.root.split('/') : /^_/.test(key) ? tree : tree.slice(0).concat(key));

					if(routes.routes) routes = routes.routes;

					routes.forEach(function(route) {
						var method = route[0];

						var p = '/' + (route[1] ? arr.concat(_.compact(route[1].split('/'))) : arr).join('/');

						if(isWin)
							p = p.split('\\').join('/');

						var mw = route[2] instanceof Array ? route[2] : [ route[2] ];

						if(!allRoutes[p]) allRoutes[p] = {};

						if(!allRoutes[p][method]) allRoutes[p][method] = mw;
						else Array.prototype.push.call(allRoutes[p][method], mw);
					});
				} else {
					recurse(value, tree.concat(key));
				}
			});
		}

		var allRoutes = {};

		if(!_.isArray(directories)) directories = [ directories ];

		directories.forEach(function(directory) {
			if(fs.existsSync(directory)) {
				recurse(requireDir(directory, { recurse: true }), []);
			}
		});

		allRoutes = _.object(_.sortBy(_.pairs(allRoutes), function(pair) { 
			// make : & * routes be placed behind all the others.
			return pair[0].split(':').join('zzzy').split('*').join('zzzz');
		}));

		return allRoutes;
	},
};
