var dust = require('dustjs-linkedin');

dust.compiled = function(template) {
	return this.template(template).compiled;
};

dust.src = function(template) {
	return this.template(template).src;
};

function dependencies(template) {
	return dust.template(template).dependencies;
}

/* Recurses through all templates dependencies
 * to return a flattened array of template names.
 */
dust.dependencies = function(templates) {
	if(!_.isArray(templates)) templates = [ templates ];

	var collected = [],
		check = templates;

	while(check.length) {
		var deps = _.uniq(_.compact(_.flatten(_.map(check, dependencies))));

		check = _.difference(deps, collected, templates);

		collected = collected.concat(check);
	}

	return collected;
};

dust.template = function(templateName) {
	var template = this.templates[templateName];

	if(!template) throw new Error('Template Not Found: ' + templateName);

	return template;
};
