const {Server} = require('socket.io');
const {getData} = require('./controller/reservation');
module.exports = (server) => {
  const io = new Server(server, {
    cors: true,
  });


  io.on('connection', (socket) => {
    socket.emit('enter', socket.id);
    socket.on('joinRoom', (room) => {
      socket.join(room);
    });
    socket.on('leaveRoom', (room) => {
      socket.leave(room);
    });
    socket.on('newReservation', (data) => {
      const {room} = JSON.parse(data);
      socket.to(room).emit('newReservation', data);
    });
    socket.on('reservationCancel', async (data) => {
      const jsonData = JSON.parse(data);
      const reservation = await getData({}, {id: jsonData.reservationId});
      const res = {
        pitch: jsonData.pitch,
        reservation: reservation.data[0],
      };
      socket.to(jsonData.room).emit('reservationCancel', JSON.stringify(res));
    });
  });
};
