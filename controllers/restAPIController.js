var logger = require('../utils/logging').logger;
var timerJobController = require('./timerJobController');

const ERROR = { status: "error" };
const SUCCESS = { status: "success" };

exports.getJobStatus = function (req, res) {
    logger.info('getJobStatus called - name: ' + req.params.name);
    res.json(timerJobController.getJobStatus(req.params.name));
}

exports.startJob = function (req, res) {
    logger.info('startJob called - name: ' + req.params.name);
    if (timerJobController.startJobByName(req.params.name)) {
        res.json(SUCCESS);
    }
    else {
        res.json(ERROR);
    }
}

exports.stopJob = function (req, res) {
    logger.info('stopJob called - name: ' + req.params.name);
    if (timerJobController.stopJobByName(req.params.name)) {
        res.json(SUCCESS);
    }
    else {
        res.json(ERROR);
    }
}