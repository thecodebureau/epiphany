var mongoose = require('mongoose');

var LogEntrySchema = new mongoose.Schema({
	body: {},
	dateCreated: { type: Date, default: Date.now },
	description: String,//
	details: {},
	module: String,
	method: String,
	message: String,
	name: String,
	path: String,
	status: Number,
	user: String,
});

module.exports = mongoose.model('LogEntry', LogEntrySchema);
