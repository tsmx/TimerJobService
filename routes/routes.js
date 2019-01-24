module.exports = function (app) {
  var restAPI = require('../controllers/restAPIController');

  // timerjob API functions
  app.get('/job/:name/status', restAPI.getJobStatus);
  app.get('/job/:name/start', restAPI.startJob);
  app.get('/job/:name/stop', restAPI.stopJob);
};