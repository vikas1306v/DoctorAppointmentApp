const cron = require('node-cron');

function performScheduledTask() {
    //logic for deleting all old slots

}

const scheduledTask = cron.schedule('0 18 * * *', performScheduledTask, {
    scheduled: true,
    timezone: "Asia/Kolkata" 
});


function startCronJobs() {
    scheduledTask.start();
}

module.exports = {
    startCronJobs
};
