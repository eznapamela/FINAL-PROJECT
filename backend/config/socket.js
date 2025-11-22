const socketIO = require('socket.io');

const configureSocket = (server) => {
  const io = socketIO(server, {
    cors: {
      origin: process.env.CLIENT_URL,
      methods: ["GET", "POST"]
    }
  });

  io.use((socket, next) => {
    // Simple authentication for sockets
    const token = socket.handshake.auth.token;
    if (token) {
      // In production, validate token against database
      socket.userId = token;
    }
    next();
  });

  io.on('connection', (socket) => {
    console.log('User connected:', socket.id);

    // Join location-based rooms
    socket.on('join_location', (location) => {
      if (location && location.lat && location.lng) {
        const room = `location_${Math.round(location.lat * 100)}_${Math.round(location.lng * 100)}`;
        socket.join(room);
      }
    });

    // Join alert-specific rooms
    socket.on('join_alerts', () => {
      socket.join('alerts');
    });

    socket.on('join_emergency', () => {
      socket.join('emergency');
    });

    socket.on('disconnect', () => {
      console.log('User disconnected:', socket.id);
    });
  });

  return io;
};

module.exports = configureSocket;