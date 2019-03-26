var cron = require('cron');
var logger = require('../utils/logging').logger;
var timerJob = require('../models/timerJobBaseModel').timerJob;
var timerJobLogEntry = require('../models/timerJobBaseModel').timerJobLogEntry;
var jobs = new Map();

function executeConsole(message) {
    logger.info('executeConsole  - ' + message);
}

function executeConsole2(message) {
    logger.info('executeConsole2 - ' + message);
    var logEntry = new timerJobLogEntry({ job: "TestJob", message: message });
    logEntry.save();
}

function generateCronJob(cronexp, type, options) {
    var cronFunc = null;
    switch (type) {
        case 'CONSOLE':
            cronFunc = () => { executeConsole(options.message); };
            break;
        case 'CONSOLE2':
            cronFunc = () => { executeConsole2(options.message); };
            break;
    }
    if (cronFunc) {
        return new cron.CronJob(cronexp, cronFunc);
    }
    else {
        return null;
    }
}

exports.initializeJobs = function (start = false) {
    logger.info('initializeJobs called, start=' + start);
    stopAllJobs();
    jobs.clear();
    logger.info('job definitions cleared, loading new definitions...');
    timerJob.find({}, function (err, jobdata) {
        if (err) {
            logger.error('could not retrieve timerjob data!');
        }
        else {
            jobdata.forEach(job => {
                logger.info('job definition found - name: ' + job.name);
                logger.info('  --> job type:    ' + job.type);
                logger.info('  --> cron:        ' + job.cron);
                logger.info('  --> description: ' + job.description);
                let cronJob = generateCronJob(job.cron, job.type, job.options);
                if (cronJob) {
                    jobs.set(job.name, cronJob);
                    logger.info('  --> job status:  created and registered');
                }
                else {
                    logger.info('  --> job status:  could not create job, please check configuration - skipped!');
                }
            });
            logger.info('job definitions loaded: ' + jobs.size);
            if (start) {
                startAllJobs();
            }
        }
    });
}

function getJobByName(jobName) {
    if (jobs.has(jobName))
        return jobs.get(jobName);
    else
        return null;
}

function getJobStatus(name) {
    var job = getJobByName(name);
    var statusdata = {};
    if (job) {
        statusdata["name"] = name;
        statusdata["running"] = job.running;
    }
    else {
        statusdata["error"] = "job not registered!";
    }
    return statusdata;
}

function logJobStatus(name, status) {
    logger.info('job status changed - name: ' + name);
    logger.info('  --> job status:  ' + status);
}

function startJobByName(name) {
    var job = getJobByName(name);
    if (job != null) {
        job.start();
        logJobStatus(name, 'started');
        return true;
    }
    else {
        logger.info('job cannot be started, not found - name: ' + name);
        return false;
    }
}

function stopJobByName(name) {
    var job = getJobByName(name);
    if (job != null) {
        job.stop();
        logJobStatus(name, 'stopped');
        return true;
    }
    else {
        logger.info('job cannot be stopped, not found - name: ' + name);
        return false;
    }
}

function startAllJobs() {
    logger.info('startAllJobs called, number of jobs: ' + jobs.size);
    for (var [name, job] of jobs) {
        job.start();
        logJobStatus(name, 'started');
    }
}

function stopAllJobs() {
    logger.info('stopAllJobs called, number of jobs: ' + jobs.size);
    for (var [name, job] of jobs) {
        job.stop();
        logJobStatus(name, 'stopped');
    }
}

exports.getJobStatus = function (name) { return getJobStatus(name); };
exports.startJobByName = function (name) { return startJobByName(name); };
exports.stopJobByName = function (name) { return stopJobByName(name); };
exports.startAllJobs = this.startAllJobs;
exports.stopAllJobs = this.stopAllJobs;