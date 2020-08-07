# TimerJobService

A generic service for executing and maintaining scheduled timer jobs using the [cron](npmjs.com/package/cron) package.

Including:
- minimalistic Mongoose MongoDB model for storing job definitions and job logging
- logging via Winston
- basic API for start/stop/status of a timer job