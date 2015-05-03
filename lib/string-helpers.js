String.prototype.toCamelCase = function(pascalCase) {

	var arr = this.split(/[\s-]/);

	for(var i = pascalCase ? 0 : 1; i < arr.length; i++) {
		arr[i] = arr[i].charAt(0).toUpperCase() + arr[i].slice(1).toLowerCase();
	}

	return arr.join('');
};

String.prototype.toPascalCase = function() {
	return this.toCamelCase(true);
};