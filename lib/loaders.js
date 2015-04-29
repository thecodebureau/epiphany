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


function camelCase(str, pascalCase) {
	str = str.toLowerCase();
	var arr = str.split(/[\s-]/);
	for(var i = pascalCase ? 0 : 1; i < arr.length; i++) {
		arr[i] = arr[i].charAt(0).toUpperCase() + arr[i].slice(1);
	}
	return arr.join('');
}

function pascalCase(str) {
	return camelCase(str, true);
}

module.exports = {
	templates: function(directory) {

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
				obj[name] = {
					src: src,
					compiled: compiled,
					dependencies: dependencies
				};
				dust.loadSource(compiled);
			}
		}

		var obj = {};
		if(fs.existsSync(directory))
			recurse(directory); 
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
						val[0] = pascalCase(val[0]);
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
								schemas[arr[0]] = arr[1](schemas);
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
				var models = _.values(requireDir(modelsDirectory, { recurse: true }));

				// Loop until all models have been initialized
				while(models.length > 0) {
					length = models.length;

					models = models.filter(function(fnc) {
						try {
							fnc(schemas);
						} catch(e) {
							// return true so failed function stays in model array
							return true;
						}

						// return false to delete function from array
						return false;
					});

					// if models are same length after on iteration unresolved errors
					// have been caused. most likely to circular reference of models.
					if(models.length === length) 
						throw new Error('Circular reference in Mongoose Models.');
				}
			}
		});
	},

	middleware: function(directories, config) {
		function recurse(obj) {
			for(var prop in obj) {
				if(obj[prop] instanceof Function) {
					var m = obj[prop](config);
					delete obj[prop];
					obj[camelCase(prop)] = m;
				} else {
					recurse(obj[prop]);
				}
			}
		}

		mw = {};

		if(!_.isArray(directories)) directories = [ directories ];

		directories.forEach(function(directory) {
			if(fs.existsSync(directory)) {
				mw = _.extend(mw, requireDir(directory, { recurse: true }));
				recurse(mw);
			}
		});

		return mw;
	},

	routes: function(directories, server, mw, config) {
		function recurse(obj, tree) {
			function init(prop, root) {
				var router = obj[prop](mw, config);

				// if root == true, do not append property to path
				var arr = root ? tree : tree.slice(0).concat(prop);

				var p = router.root || path.join('/', arr.join('/'));

				if(isWin)
					p = p.split('\\').join('/');

				server.use(p, router);
			}

			tree = tree || [];

			if(obj._pre) init('_pre', true);

			for(var prop in obj) {
				if(obj[prop] instanceof Function) {
					switch(prop) {
						case '_index':
						case '_post':
						case '_pre':
							continue;
					}
					init(prop);
				} else {
					recurse(obj[prop], tree.concat(prop));
				}
			}

			if(obj._index) init('_index', true);

			if(obj._post) init('_post', true);
		}
		
		if(!_.isArray(directories)) directories = [ directories ];

		directories.forEach(function(directory) {
			if(fs.existsSync(directory)) {
				recurse(requireDir(directory, { recurse: true }));
			}
		});
	},
};
