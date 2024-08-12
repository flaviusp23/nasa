const express = require('express');
const {
  httpGetAllLaunches,
  httpAddNewLaunch,
  httpAbortLaunch,
  httpGetAllLaunchesUpcoming,
  httpGetAllLaunchesHistory,
} = require('./launches.controller');

const launchesRouter = express.Router();

launchesRouter.get('/', httpGetAllLaunches);
launchesRouter.get('/upcoming', httpGetAllLaunchesUpcoming);
launchesRouter.get('/history', httpGetAllLaunchesHistory);
launchesRouter.post('/', httpAddNewLaunch);
launchesRouter.delete('/:id', httpAbortLaunch);

module.exports = launchesRouter;