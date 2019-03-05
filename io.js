/**
 * Created by markb on 30/06/2017.
 */
const sio = require('socket.io');
const logger = require('./logger');

let io = null;

// Exported instantiated socket io object
exports.io = function () {
  return io;
};

//  Intstantiate socket io object
exports.initialize = function (server) {
  io = sio(server);
}