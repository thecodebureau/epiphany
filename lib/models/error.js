module.exports = function(mongoose, schemas, plugins) {
	var ErrorSchema = new mongoose.Schema({
		message: { type: String, required: true },// standard
		name: { type: String, required: true },// standard
		fileName: String,// non-standard, MDN
		columnNumber: Number,// non-standard, MDN
		lineNumber: Number,// non-standard, MDN
		stack: String,// non-standard, MDN
		status: Number,// non-standard, TCB
		statusText: String,// non-standard, TCB - usually the same as message
		details: {},
		path: String,// non-standard, TCB - mainly used for 404 
		description: String,//
		dateCreated: { type: Date, default: Date.now }
	});

	mongoose.model('Error', ErrorSchema);
};
