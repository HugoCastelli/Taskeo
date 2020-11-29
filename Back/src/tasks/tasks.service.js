const db = require('../../firebase.config');
const moment = require('moment');


module.exports.handleTimers = function(periods, oldStatus, newStatus) {
    try {
        const date = new Date().getTime();
        const newPeriodArray = [];

        switch (oldStatus && newStatus) {
            case 'stopped' && 'running': {
                newPeriodArray.push(date);
                periods.push(newPeriodArray);
            }
            case 'running' && 'stopped': {
                console.log(periods[periods.length - 1]);
            }
        }
        console.log(periods);
        return periods;
    } catch (e) {
        console.error(e);
        return false;
    }
}

function formatTime(timestamp) {
    return moment(timestamp).utc(false).format('HH:mm:ss');
}

module.exports.getTimer = function (timestamps) {
    try {
        let timer = 0;

        for (let i = 0; i < timestamps.length - 1 ; i += 2) {
            timer += timestamps[i + 1] - timestamps[i];
        }

        return formatTime(timer);

    } catch (e) {
        console.error(e);
        return false;
    }
}


module.exports.getActualTime = async function(tasks) {
    try {
        const actualDate = new Date().getTime();
        let timer;

        if (tasks.length !== undefined) {
            for (const task of tasks) {
                timer = await db.collection('timers').where('taskId', '==', task.taskId)
                    .where('finished', '==', false).get();
                if (!timer.empty) {
                    let lastTimeStamp = 0;
                    const timeStamps = timer.docs[0].data()['timestamps'];

                    if (task.status === 'paused') {
                        lastTimeStamp = timeStamps[timeStamps.length - 2];
                        task.timer = formatTime(actualDate - lastTimeStamp);
                    } else if (task.status === 'running') {
                        lastTimeStamp = timeStamps[timeStamps.length - 1];
                        task.timer = formatTime(actualDate - lastTimeStamp);
                    } else if (task.status === 'stopped' || task.status === null) {
                        task.timer = '00:00:00';
                    }
                }
            }
        } else {
            timer = await db.collection('timers').where('taskId', '==', tasks.taskId)
                .where('finished', '==', false).get();
            if (!timer.empty) {
                let lastTimeStamp = 0;
                const timeStamps = timer.docs[0].data()['timestamps'];

                if (tasks.status === 'paused') {
                    lastTimeStamp = timeStamps[timeStamps.length - 2];
                    tasks.timer = formatTime(actualDate - lastTimeStamp);
                } else if (tasks.status === 'running') {
                    lastTimeStamp = timeStamps[timeStamps.length - 1];
                    tasks.timer = formatTime(actualDate - lastTimeStamp);
                } else if (tasks.status === 'stopped' || tasks.status === null) {
                    tasks.timer = '00:00:00';
                }
            }
        }

        return tasks;
    } catch (e) {
        console.error(e);
        return false;
    }
}
