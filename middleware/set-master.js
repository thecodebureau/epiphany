module.exports = function(config) {
	return function(master) {
		return function setMaster(req, res, next) {
			res.master = master;
			next();
		};
	};
};
