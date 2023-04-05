/* eslint-disable etc/no-commented-out-code */
// const testCron = require("./test.cron");
const monitorIntentCronJob = require("./monitorIntent.cron");


const runCronJobs = () => {
    // testCron.start();
    monitorIntentCronJob.start()
};

module.exports = runCronJobs;

// # ┌────────────── second (optional)
// # │ ┌──────────── minute
// # │ │ ┌────────── hour
// # │ │ │ ┌──────── day of month
// # │ │ │ │ ┌────── month
// # │ │ │ │ │ ┌──── day of week
// # │ │ │ │ │ │
// # │ │ │ │ │ │
// # * * * * * *