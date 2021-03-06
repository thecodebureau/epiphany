// modules > native
var p = require('path');

// modules > 3rd party
var chalk = require('chalk');

module.exports = function(stack) {
	if(!stack) return;

	stack = stack.replace(/\/[\/\w.-]+/g, function(match) {
		if(match.indexOf('node_modules') > -1) 
			return match;

		var dir = p.dirname(PWD);
		var index = match.indexOf(dir);

		if(index > -1) {
			var endIndex = index + dir.length;
			return match.slice(0, endIndex) + chalk.yellow(match.slice(endIndex));
		}

		return chalk.yellow(match);
	});

	return stack;
};
