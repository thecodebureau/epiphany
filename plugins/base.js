module.exports = function basePlugin(schema, options) {
	schema.add({
		dateCreated: { type: Date, default: Date.now },
		dateModified: Date,
		datePublished: Date
	});

	// TODO perhaps this should be made parallel
	schema.pre('save', function (next) {
		if(!this.isNew) {
			var modified = this.modifiedPaths().slice(0);

			var i = modified.indexOf('datePublished');

			if(i > -1)
				modified.splice(i, 1);

			if(modified.length > 0) 
				this.dateModified = new Date();
		}

		next();
	});
};
