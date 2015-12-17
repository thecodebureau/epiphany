var basePort = 4080;

module.exports = {
	development: basePort,
	testing: basePort + 1,
	staging: basePort + 2,
	production: basePort + 3
}[ENV];