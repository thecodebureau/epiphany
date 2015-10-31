var mongoose = require('mongoose');

mongoose.Schema.prototype.objectify = function(returnId) {
	var o = {};
	_.each(this.paths, function(val, key) {
		var path = key.split('.');

		var ref = o;

		var i;

		for (i = 0; i < path.length - 1; i++) {
			if (!ref[path[i]]) {
				ref[path[i]] = {};
			}

			ref = ref[path[i]];
		}

		ref[path[i]] = val.options;
	});

	if(!returnId) 
		delete o._id;

	return o;
};

mongoose.Schema.prototype.pick = function(returnId) {
	return _.pick.apply(null, [ this.objectify(returnId), '@context', '@type' ].concat(arguments));
};
