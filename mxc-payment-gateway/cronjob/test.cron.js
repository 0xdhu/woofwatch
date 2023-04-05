/* eslint-disable etc/no-commented-out-code */
const cron = require("node-cron");

// Every 5 minutes
const testCron = cron.schedule(
    "*/5 * * * *",
    () => {
        testFunction();
    },
    {
        scheduled: false,
    }
);

module.exports = testCron;

const testFunction = async () => {
    try {
        console.log("Test cron")
    } catch (ex) {
        console.log(ex);
    }
}