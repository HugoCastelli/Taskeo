const express = require('express');
const authentificationController = require('./authentification.controller')

const router = express.Router();

router.route('/register')
    .post(authentificationController.register);

router.route('/login')
    .post(authentificationController.login);

router.route('/delete')
    .delete(authentificationController.delete);

module.exports = router;
