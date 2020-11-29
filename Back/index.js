const express = require('express');
const bodyparser = require('body-parser')
const db = require('./firebase.config')
var cors = require('cors')


const authentificationRoutes = require('./src/authentification/authentification.router');
const tasksRoute = require('./src/tasks/tasks.router')

const main = express();
const app = express();

main.use(bodyparser.json());
main.use(cors())
main.use('/api/v1', app);

// Setting up router
app.use('/authentification', authentificationRoutes);
app.use('/tasks', tasksRoute);

// starting listening on port 8080
main.listen(8080, () => {
    console.log('API listening on port 8080 🎉');
})

module.exports = main;
