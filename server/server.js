#!/usr/bin/env node

var io = require('socket.io').listen(8080);

io.configure(function() {
  io.set('log level', 2);
});

io.sockets.on('connection', function ( socket ) {
  socket.on('msg', function ( msg ) {
    console.log('broadcast: ', msg);
    socket.broadcast.emit('msg', msg);
  });
});