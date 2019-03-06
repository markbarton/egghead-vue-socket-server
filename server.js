const dotenv = require("dotenv").config({
    path: "variables.env"
});
const express = require('express');
const app = express();
const pjson = require("./package.json");
const path = require('path');
const server = require('http').Server(app);
const logger = require('./logger');
const port = process.env.PORT || 8500;
const io = require('./io').initialize(server);
const socket = require('./io').io();

// Static file service
app.use(express.static(path.join(__dirname, 'public')));

// Start the express server
server.listen(port);

logger.info(`${pjson.name} Server Started >> `);
logger.info(`running in ${process.env.NODE_ENV}`);
logger.info(`running on port ${port}`);

setInterval(function () {
    socket.emit('PULSE', heartbeat());
}, 1000);

function heartbeat() {
    return Math.ceil(Math.random() * (120 - 80) + 80);
}