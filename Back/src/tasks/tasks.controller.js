const db = require('../../firebase.config');
const token = require('rand-token');
const tasksService = require('./tasks.service');


/**
 * @api {post} /tasks Create a task
 * @apiName Create a task
 * @apiGroup Tasks
 * @apiDescription Creating a new task for a user
 * @apiVersion 0.0.1
 *
 * @apiHeader {String} Authorization Bearer token.
 * @apiHeaderExample {json} Request-Example:
 *     {
 *       "Authorization": "Bearer XXXXXXXXXXXXXXXXXXX"
 *     }
 *
 * @apiParam {String} name New task name.
 * @apiParam {String} description New task description.
 * @apiParam {String} creationDate New task creation date.
 * @apiParam {String} priority New task priority.
 *
 * @apiParamExample {json} Request-Example:
 *     {
 *       "name": "Task n°1",
 *       "description": "This is a task description (HTML compatible)",
 *       "creationDate": "Sun Nov 15 2020 14:16:26 GMT+0100",
 *       "priority": "low|medium|high|null"
 *     }
 *
 * @apiSuccessExample Success-Response:
 *     HTTP/1.1 200 OK
 *     {
 *          "name": "Task n°1",
 *          "description": "This is a task description (HTML compatible)",
 *          "creationDate": "Sun Nov 15 2020 14:16:26 GMT+0100",
 *          "priority": "low|medium|high|null",
 *          "timer": "00:00:00",
 *          "taskId": "XXXXXXXXX",
 *          "userId": "XXXXX",
 *          "status": "stopped"
 *     }
 */
module.exports.create = async function (req, res, next) {
    try {
        const {user, body} = req;

        if (!user || !body || !body.name || !body.creationDate)
            throw 'MissingData';

        const newTaskData = body;
        newTaskData.taskId = token.uid(10);
        newTaskData.userId = user.userId;
        newTaskData.status = 'stopped';
        newTaskData.timer = "00:00:00";
        newTaskData.periods = [];

        // TMP
        

        const newTask = db.collection('tasks').doc(newTaskData.taskId).set(newTaskData);

        res.status(200).send(newTaskData);
    } catch (e) {
        console.error(e);
        res.status(400).send({message: e});
    }
}


/**
 * @api {put} /tasks/:taskId Update a task
 * @apiName Update a task
 * @apiGroup Tasks
 * @apiDescription Updating a task for a user
 * @apiVersion 0.0.1
 *
 * @apiHeader {String} Authorization Bearer token.
 * @apiHeaderExample {json} Request-Example:
 *     {
 *       "Authorization": "Bearer XXXXXXXXXXXXXXXXXXX"
 *     }
 *
 * @apiParam {String} name Task name (OPTIONAL).
 * @apiParam {String} description Task description (OPTIONAL).
 * @apiParam {String} priority Task description (low|medium|high|null) (OPTIONAL).
 *
 * @apiParamExample {json} Request-Example:
 *     {
 *       "name": "Task n°1",
 *       "description": "This is a task description (HTML compatible)",
 *       "priority": "low|medium|high|null"
 *     }
 *
 * @apiSuccessExample Success-Response:
 *     HTTP/1.1 200 OK
 *     {
 *          "name": "Task n°1",
 *          "description": "This is a task description (HTML compatible)",
 *          "creationDate": "Sun Nov 15 2020 14:16:26 GMT+0100",
 *          "priority": "low|medium|high|null",
 *          "status": "running|paused|stopped",
 *          "timer": "XX:XX:XX",
 *          "taskId": "XXXXXXXXX",
 *          "userId": "XXXXX",
 *     }
 */
module.exports.update = async function (req, res, next) {
    try {
        const {user, body} = req;
        const taskId = req.params.taskId;

        if (!user || !body || !taskId)
            throw 'MissingData';

        const findedTask = await db.collection('tasks').doc(taskId).get();
        if (!findedTask.exists)
                throw 'TaskNotFound';

        let taskData = {};

        // Putting parameters wanted to be changed in an array
        for (const param in body) {
            taskData[param] = body[param];
        }

        await findedTask.ref.update(taskData);
        let updatedTask = (await findedTask.ref.get()).data();

        updatedTask = await tasksService.getActualTime(updatedTask);

        res.status(200).send(updatedTask);
    } catch (e) {
        console.error(e);
        res.status(400).send({message: e});
    }
}


/**
 * @api {get} /tasks?(optionalParams) Get task
 * @apiName Get a task
 * @apiGroup Tasks
 * @apiDescription Get one or multiples tasks (depending on filters)
 * @apiVersion 0.0.1
 *
 * @apiHeader {String} Authorization Bearer token.
 * @apiHeaderExample {json} Request-Example:
 *     {
 *       "Authorization": "Bearer XXXXXXXXXXXXXXXXXXX"
 *     }
 *
 * @apiParam {String} taskId Get a task by ID (OPTIONAL).
 * @apiParam {String} priority Get task list by priority (OPTIONAL).
 * @apiParam {String} status Get task list by status (OPTIONAL).
 *
 *
 * @apiSuccessExample Success-Response:
 *     HTTP/1.1 200 OK
 *     {
 *          [
 *              {
 *                  "priority": "low",
 *                  "name": "Task",
 *                  "description": "This is a task description (HTML csqdqsdosdti)",
 *                  "priority": "low|medium|high|null",
 *                  "status": "running|paused|stopped",
 *                  "timer": "XX:XX:XX",
 *                  "userId": "XXXXX",
 *                  "taskId": "XXXXXXXXXX",
 *                  "creationDate": "Sun Nov 15 2020 14:16:26 GMT+0100"
 *              },
 *              {
 *                  "priority": "low",
 *                  "creationDate": "Sun Nov 15 2020 14:16:26 GMT+0100",
 *                  "name": "Task n°1",
 *                  "priority": "low|medium|high|null",
 *                  "status": "running|paused|stopped",
 *                  "timer": "XX:XX:XX",
 *                  "userId": "XXXXX",
 *                  "taskId": "XXXXXXXXXX",
 *                  "description": "This is a task description (HTML compatible)"
 *              }
 *          ]
 *     }
 */
module.exports.get = async function (req, res, next) {
    try {
        const {user} = req;
        const {taskId, priority, status} = req.query;
        let findedTasks;
        let tasksArray = [];


        if (!user)
            throw 'MissingData';
        if (req.query.length > 1)
            throw 'TooManyParameters';

        findedTasks = db.collection('tasks');
        findedTasks = findedTasks.where('userId', '==', user.userId);

        if (taskId) {
            findedTasks = findedTasks.where('taskId', '==', taskId)
        }
        if (priority) {
            findedTasks = findedTasks.where('priority', '==', priority);
        }
        if (status) {
            findedTasks = findedTasks.where('status', '==', status);
        }

        await findedTasks.get().then(tasks => {
            tasks.forEach(task => {
               tasksArray.push(task.data());
            });
        });

        tasksArray = await tasksService.getActualTime(tasksArray);

        res.status(200).send(tasksArray);
    } catch (e) {
        console.error(e);
        res.status(400).send({message: e});
    }
}


/**
 * @api {delete} /tasks/:taskId Delete task
 * @apiName Delete a task
 * @apiGroup Tasks
 * @apiDescription Deleting a task
 * @apiVersion 0.0.1
 *
 * @apiHeader {String} Authorization Bearer token.
 * @apiHeaderExample {json} Request-Example:
 *     {
 *       "Authorization": "Bearer XXXXXXXXXXXXXXXXXXX"
 *     }
 *
 * @apiParam {String} taskId Delete task ID.
 *
 *
 * @apiSuccessExample Success-Response:
 *     HTTP/1.1 200 OK
 *     {
 *          message: 'TaskDeleted'
 *     }
 */
module.exports.delete = async function (req, res, next) {
    try {
        const {user} = req;
        const {taskId} = req.params;

        if (!user || !taskId)
            throw 'MissingData';

        const findedTask = await db.collection('tasks').doc(taskId).get();
        if (!findedTask.exists) {throw 'TaskNotFound';}

        await findedTask.ref.delete();

        res.status(200).send({message: 'TaskDeleted'});
    } catch (e) {
        console.error(e);
        res.status(400).send({message: e});
    }
}


/**
 * @api {post} /tasks/updateTimers/:taskId Update a task timer
 * @apiName Update a task timer
 * @apiGroup Tasks
 * @apiDescription Updating a timer status for a chosen task
 * @apiVersion 0.0.1
 *
 * @apiHeader {String} Authorization Bearer token.
 * @apiHeaderExample {json} Request-Example:
 *     {
 *       "Authorization": "Bearer XXXXXXXXXXXXXXXXXXX"
 *     }
 *
 * @apiParam {String} status New tasks status.
 *
 * @apiParamExample {json} Request-Example:
 *     {
 *       "status": "running|paused|stopped"
 *     }
 *
 * @apiSuccessExample Success-Response:
 *     HTTP/1.1 200 OK
 *     {
 *          "name": "Task n°1",
 *          "description": "This is a task description (HTML compatible)",
 *          "creationDate": "Sun Nov 15 2020 14:16:26 GMT+0100",
 *          "priority": "low|medium|high|null",
 *          "status": "running|paused|stopped",
 *          "timer": "XX:XX:XX",
 *          "taskId": "XXXXXXXXX",
 *          "userId": "XXXXX",
 *     }
 */
module.exports.updateTimers = async function(req, res, next) {
    try {
        const {user, body} = req;
        const taskId = req.params.taskId;

        if (!user || !body || !taskId)
            throw 'MissingData';

        const findedTask = await db.collection('tasks').doc(taskId).get();
        if (!findedTask.exists)
            throw 'TaskNotFound';

        await findedTask.ref.update({status: body.status});

        const oldStatus = findedTask.get('status');
        const newStatus = body.status;
        const date = new Date().getTime();

        const period = await db.collection('timers').where('taskId', '==', taskId)
            .where('finished', '==', false).get();
        let timestamps = [];

        console.log(oldStatus, newStatus);

        // If status was stopped
        if (oldStatus === 'stopped' && newStatus === 'running') {
            let newPeriodData = {
                periodId: token.uid(10),
                taskId,
                finished: false,
                timestamps: [date]
            };
            const newPeriod = await db.collection('timers').doc(newPeriodData.periodId).set(newPeriodData);
        }
        // If status is paused
        else if (oldStatus === 'running' && newStatus === 'paused') {
            console.log('paused');
            timestamps = period.docs[0].get('timestamps');
            timestamps.push(date);
            await period.docs[0].ref.update({timestamps});
        }
        // If status running after paused
        else if (oldStatus === 'paused' && newStatus === 'running') {
            console.log('running after pause');
            timestamps = period.docs[0].get('timestamps');
            timestamps.push(date);
            await period.docs[0].ref.update({timestamps});
        }
        // If status stopped
        else if (oldStatus === 'running' && newStatus === 'stopped') {
            console.log('stopped');
            timestamps = period.docs[0].get('timestamps');
            timestamps.push(date);
            await period.docs[0].ref.update({timestamps, finished: true});
        }

        const resTaskData = findedTask.data();
        resTaskData.status = newStatus;
        resTaskData.timer = tasksService.getTimer(timestamps);

        res.status(200).send(resTaskData);
    } catch (e) {
        console.error(e);
        res.status(400).send({message: e});
    }
}
