var jobController = require('./controllers/timerJobController.js');
jobController.initializeJobs(true);


var express = require('express');
var logger = require('./utils/logging').logger;
var app = express();

var routes = require('./routes/routes'); //importing route
routes(app); //register the route

app.listen(3000, function () {
  logger.info('TimerJobService listening on port 3000...');
});