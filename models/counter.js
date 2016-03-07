var mongoose = require('mongoose');
// counters used for auto-incrementing sequence fields

var CounterSchema = new mongoose.Schema({
	_id: String,
	seq: Number
});

CounterSchema.statics.getNextSequence = function(name, callback) {
	this.findOneAndUpdate({ _id: name }, { $inc: { seq: 1 } }, function(err, counter) {
		callback(err, counter && counter.seq);
	});
};

module.exports = mongoose.model('Counter', CounterSchema);
