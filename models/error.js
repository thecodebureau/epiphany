var mongoose = require('mongoose');

var ErrorSchema = new mongoose.Schema({
	body: {},
	columnNumber: Number,// non-standard, MDN
	dateCreated: { type: Date, default: Date.now },
	description: String,//
	details: {},
	fileName: String,// non-standard, MDN
	ip: String,// non-standard, TCB
	lineNumber: Number,// non-standard, MDN
	method: String,
	message: String,// standard
	name: String,// standard
	path: String,// non-standard, TCB - mainly used for 404 
	query: {},
	stack: String,// non-standard, MDN
	status: Number,// non-standard, TCB
	statusText: String,// non-standard, TCB - usually the same as message
	user: String,// non-standard, TCB
	xhr: Boolean,// non-standard, TCB
});

module.exports = mongoose.model('Error', ErrorSchema);
