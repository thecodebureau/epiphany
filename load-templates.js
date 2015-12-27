// modules > native
var fs = require('fs');
var p = require('path');

// modules > 3rd-party
var chalk = require('chalk');
var debug = require('debug')('epiphany:loaders');
var dust = require('dustjs-linkedin');

var warningPrefix = '[' + chalk.yellow('!!') + '] ';
var isWin = /^win/.test(process.platform);

module.exports = function(directory) {
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

			/* use regex to determine the names of any templates the current template
			 * includes
			 */
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
};
