/**
 * Created by markb on 30/06/2017.
 */
const sio = require('socket.io');
const logger = require('./logger');

let io = null;
const users = new Map();
const ids = new Map();

exports.io = function () {
  return io;
};

exports.initialize = function (server) {
  io = sio(server);
  io.on('connection', (socket) => {
    logger.debug(`A user connected with ${socket.id}`);

    socket.on('UPDATE_USER', function (data, fn) {
      logger.debug(`UPDATE_USER triggered for ${data.name}`)
      // Map Socket ID with a User
      users.set(data.name, {
        socket_id: socket.id,
        ...data
      });
      ids.set(socket.id, data);

      // Also join a room / group
      socket.join(data.group);

      // If callback
      if (fn) {
        fn('success')
      }
    });

    socket.on('SEND_MESSAGE', function (data) {
      // If we have a name then its to a person else group
      let recipient = '';
      if (data.name) {
        const user = users.get(data.name);
        recipient = user.socket_id;
      } else {
        recipient = data.group;
      }
      logger.debug(`POPUP_NOTIFICATION triggered for ${recipient}`)
      io.to(recipient).emit('POPUP_NOTIFICATION', data);
    });

    socket.on('DIALOG_RESPONSE', function (data) {
      // If we have a name then its to a person else group
      const user_data = ids.get(socket.id);
      logger.debug(`${user_data.name} has pressed ${data.response}`);
    });

  });
};