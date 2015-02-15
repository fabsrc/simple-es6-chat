var restify = require('restify'),
  express = require('express'),
  mongoose = require('mongoose'),
  restifyMongoose = require('restify-mongoose'),
  autoIncrement = require('mongoose-auto-increment'),
  faker = require('faker');



/*=============================
=            Ports            =
=============================*/

var httpPort = 3000;
var mongoPort = 8000;



/*====================================
=            Mongo Server            =
====================================*/

var mongoServer = restify.createServer();
mongoServer.pre(restify.pre.sanitizePath());
mongoServer.use(restify.bodyParser());
mongoServer.use(restify.acceptParser(mongoServer.acceptable));
mongoServer.use(restify.queryParser());
mongoServer.use(restify.CORS());
mongoServer.use(restify.fullResponse());
var db = mongoose.connect('mongodb://localhost/chat');
autoIncrement.initialize(db);
mongoServer.listen(mongoPort);


/*====================================
=            Mongo Models            =
====================================*/

var ChatRoomSchema = new mongoose.Schema({
  users: Array
},{
  toObject: { virtuals: true },
  toJSON: { virtuals: true }
});
ChatRoomSchema.plugin(autoIncrement.plugin, {
  model: 'ChatRoom',
  startAt: 1
});
mongoose.model('ChatRoom', ChatRoomSchema);
var ChatRoom = mongoose.model('ChatRoom');
var chatrooms = restifyMongoose(ChatRoom);



/*=====================================
=            Mongo Routes             =
=====================================*/

mongoServer.get('/chatrooms', chatrooms.query());
mongoServer.get('/chatrooms/:id', chatrooms.detail());
mongoServer.post('/chatrooms', chatrooms.insert());
mongoServer.patch('/chatrooms/:id', chatrooms.update());
mongoServer.del('/chatrooms/:id', chatrooms.remove());



/*===================================
=            Express Server         =
===================================*/

var app = express();
app.use(express.static(__dirname));
var server = app.listen(httpPort);



/*=======================================
=            SocketIO Server            =
=======================================*/

var io = require('socket.io')(server);

io.on('connection', function(socket) {
  'use strict';

  // Store the username in the socket session for this client
  socket.username = socket.username || faker.name.firstName();

  function joinRoom(room) {
    // Store the room name in the socket session for this client
    socket.room = room;

    // Add the client's username to the UserList in Chatroom
    ChatRoom.update({
      '_id': room
    }, {
      $push: {
        users: socket.username
      }
    }, {}, function() {
      // Send event to update rooms on clients
      io.sockets.emit('updateUserList');
    });

    // Send client to room
    socket.join(room);

    // Echo to client they've connected
    socket.emit('message', 'SERVER',
      'You (' + socket.username + ') have connected to room ' +
      socket.room);

    // Echo to room that a person has connected to their room
    socket.broadcast.to(socket.room).emit('message', 'SERVER',
      socket.username + ' has connected to this room');
  }

  function leaveRoom() {
    // Return if client is in no room
    if (!socket.room) return;

    // Emit message to current room
    socket.broadcast.to(socket.room).emit('message', 'SERVER',
      socket.username + ' has left this room');

    // Remove username from room's userlist
    ChatRoom.update({
      '_id': socket.room
    }, {
      $pull: {
        users: socket.username
      }
    }, {}, function() {
      // Send event to update rooms on clients
      io.sockets.emit('updateUserList');
    });

    // Leave room
    socket.leave(socket.room);

    // Set current room to null
    socket.room = null;
  }

  socket.on('joinRoom', function(room) {
    joinRoom(room);
  });
  socket.on('leaveRoom', leaveRoom);
  socket.on('disconnect', leaveRoom);
  socket.on('message', function(msg) {
    io.sockets.in(socket.room).emit('message', socket.username, msg);
  });
});
