const express = require('express');
const tasksController = require('./tasks.controller')
const auth = require('../auth');

const router = express.Router();

router.route('/')
    .post(auth, tasksController.create)
    .get(auth, tasksController.get)

router.route('/:taskId')
    .put(auth, tasksController.update)
    .delete(auth, tasksController.delete)

router.route('/updateTimers/:taskId')
    .post(auth, tasksController.updateTimers)

module.exports = router;
