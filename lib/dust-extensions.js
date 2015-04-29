var dust = require('dustjs-linkedin');
var _ = require('lodash');

dust.compiled = function(template) {
	return this.template(template).compiled;
};

dust.src = function(template) {
	return this.template(template).src;
};

dust.dependencies = function(template) {
	var all = [],
		check = [ dust.template(template).dependencies ],
		deps,
		prev = null;

	while(deps = check.shift()) {
		if(deps === prev) throw new Error('Circular reference in Dust templates.');

		all = _.union(all, deps);

		for(var i = 0; i < deps.length; i++) {
			var dependencies = dust.template(deps[i]).dependencies;

			if(dependencies) check.push(dependencies);
		}

		prev = deps;
	}

	return all;
};

dust.template = function(templateName) {
	var template = this.templates[templateName];
	if(!template) throw new Error('Template Not Found: ' + templateName);
	return template;
};
