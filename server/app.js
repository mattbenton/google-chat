// var app = require('http').createServer(handler)
//   , io = require('socket.io').listen(app)
//   , fs = require('fs')

// app.listen(8080);

// function handler (req, res) {
//   fs.readFile(__dirname + '/index.html',
//   function (err, data) {
//     if (err) {
//       res.writeHead(500);
//       return res.end('Error loading index.html');
//     }

//     res.writeHead(200);
//     res.end(data);
//   });
// }

var io = require('socket.io').listen(8080);

// var clients = {};

io.sockets.on('connection', function ( socket ) {
  // socket.on('login', function ( msg ) {
  //   var client = {
  //     email: msg.email,
  //     socket: socket
  //   };
  // });

  socket.on('msg', function ( msg ) {
    socket.broadcast.emit('msg', msg);
  });
});

// var chat = io.of('/chat');

// var messages = [];

// function MessageList () {
//   this.queue = [];
//   this.delay = 0;
// }

// MessageList.prototype.add = function ( text, isMe ) {
//   this.queue.push({
//     text: text,
//     isMe: isMe
//   });

//   this.delay = 0;
//   return this;
// };

// MessageList.prototype.me = function ( text ) {
//   this.add(text, true);
//   return this;
// };

// MessageList.prototype.you = function ( text ) {
//   this.add(text, false);
//   return this;
// };

// MessageList.prototype.wait = function ( delay ) {
//   this.queue.push({ wait: delay });
//   return this;
// };

// MessageList.prototype.walk = function ( fn ) {
//   var self = this;
//   var item = this.queue.shift();
//   if ( item ) {
//     if ( item.wait ) {
//       setTimeout(function() {
//         self.walk(fn);
//       }, item.wait);
//     } else {
//       fn(item);
//       self.walk(fn);
//     }
//   }
// };

// var list = new MessageList()
//   .me("Hello!")
//   .wait(3000)
//   .you("Oh hey!")
//   .wait(1000)
//   .you("How are you?")
//   .wait(6000)
//   .me("Yeah, I'm pretty good :) What's new?")
//   .wait(5000)
//   .you("Not much really.. just work and stuff, you know");

// chat.on('connection', function ( socket ) {
//   console.log('connected');

//   // socket.send('hello');

//   // list.walk(function( item ) {
//   //   socket.send(item);
//   // });

//   socket.emit('msg', { text:'helasdf'});

// });

// // io.sockets.on('connection', function (socket) {
// //   socket.emit('news', { hello: 'world23' });
// //   socket.on('my other event', function (data) {
// //     console.log(data);
// //   });

// //   socket.on('disconnect', function (socket) {
// //     console.log('someone disconnected');
// //   });
// // });