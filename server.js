const dotenv = require("dotenv").config({
    path: "variables.env"
});
const express = require('express');
const app = express();
const pjson = require("./package.json");
const path = require('path');
const http = require('http').Server(app);
const logger = require('./logger');
const bodyParser = require('body-parser');
require('./io').initialize(http);
const socket = require('./io').io();

const port = process.env.PORT || 8500;

app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public')));

app.post('/notification',
    function (req, res) {
        logger.debug(`Message Recieved: ${req.body.message}`)
        socket.emit('POPUP_NOTIFICATION', {
            message: req.body.message,
            color: req.body.color
        })
        res.send();
    }
)
http.listen(port);

logger.info(`${pjson.name} Server Started >> `);
logger.info(`running in ${process.env.NODE_ENV}`);
logger.info(`running on port ${port}`);


setInterval(function () {
    socket.emit('PULSE', heartbeat());
}, 1000);

function heartbeat() {
    return Math.ceil(Math.random() * (120 - 80) + 80);
}