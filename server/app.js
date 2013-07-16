#!/usr/bin/env node

var io = require('socket.io').listen(8080);

io.configure(function() {
  io.set('log level', 1);
});

var users = {};

// var clients = {};

io.sockets.on('connection', function ( socket ) {
  socket.on('msg', function ( msg ) {
    socket.broadcast.emit('msg', msg);
  });

  // socket.on('login', function( user ) {
  //   console.log('login: ', user);
  //   var sockets = users[user] || [];
  //   sockets.push(socket);
  //   users[user] = sockets;

  //   sendToUser(user);
  // });
});

// function sendToUser ( user ) {
//   var sockets = users[user];
//   if ( sockets ) {
//     console.log('sending to user `%s`', user);
//     sockets.forEach(function ( socket ) {
//       socket.send('hello from server!');
//     });
//   }
// }