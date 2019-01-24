// declare and export a logger with local timestamp

var winston = require('winston');
var format = winston.format;

const myFormat = format.printf((info) => {
	return `${info.timestamp} ${info.level.toUpperCase()} ${info.message}`;
});

var logger = winston.createLogger({
	format: format.combine(format.timestamp(), myFormat),
	transports: [new winston.transports.Console()]
});

// export a basic logger object
module.exports.logger = logger;