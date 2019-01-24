var mongoose = require('../utils/db.js');

// schema for basic timerjob data
var timerJob = mongoose.Schema({
	name: {
		type: String,
		unique: true,
	},
	cron: String,
	type: String,
	options: mongoose.Schema.Types.Mixed,
	description: String
});

// schema for log entry data
var timerJobLogEntry = mongoose.Schema ({
	job: String,
	date: Date,
	message: String
});

// compile & export the master data model
module.exports.timerJob = mongoose.model('timerjob', timerJob, 'timerjob');
module.exports.timerJobLogEntry = mongoose.model('timerJobLogEntry', timerJobLogEntry, 'timerjoblogentry');