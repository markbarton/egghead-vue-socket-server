/**
 * Created by markb on 30/06/2017.
 */
const sio = require('socket.io');
const logger = require('./logger');

let io = null;

exports.io = function () {
  return io;
};