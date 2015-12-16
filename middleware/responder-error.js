var colorizeStack = require('../util/colorize-stack');

module.exports = function responderError(err, req, res, next) {
	console.error('[!!!] ERROR IN RESPONDER');
	console.error(err);

	if(err)
		console.error(colorizeStack(err.stack));

	if(res.locals.error) {
		console.error('[!!!] ORIGINAL ERROR');
		console.error(_.omit(res.locals.error, 'stack'));

		if(res.locals.error.stack)
			console.error(ENV === 'development' ? formatStack(res.locals.error.stack) : res.locals.error.stack);
	}
	res.send((res.locals.error || err) + '');
};
