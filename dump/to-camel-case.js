function toCamelCase(obj) {
	var out = {};

	_.each(obj, function(value, key) {
		if(_.isPlainObject(value)) value = toCamelCase(value);

		out[_.camelCase(key)] = value;
	});

	return out;
}

