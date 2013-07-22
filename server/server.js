#!/usr/bin/env node

var io = require('socket.io').listen(8080);

io.configure(function() {
  io.set('log level', 2);
});

io.sockets.on('connection', function ( socket ) {
  // Simply broadcast each message from a client to all other clients.
  // Messages have the format `{ email: "...", message: "..." }` where
  // `email` is used to identify the sender.
  socket.on('msg', function ( msg ) {
    console.log('broadcast: ', msg);
    socket.broadcast.emit('msg', msg);
  });
});