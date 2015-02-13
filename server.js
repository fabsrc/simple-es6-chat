var restify = require('restify'),
  express = require('express'),
  mongoose = require('mongoose'),
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
var db = mongoose.connect('mongodb://localhost/chat');
autoIncrement.initialize(db);



/*====================================
=            Mongo Models            =
====================================*/

var ChatRoomSchema = new mongoose.Schema({
  id: Number,
  users: Array
});
ChatRoomSchema.plugin(autoIncrement.plugin, {
  model: 'ChatRoom',
  field: 'id',
  startAt: 1
});
mongoose.model('ChatRoom', ChatRoomSchema);
var ChatRoom = mongoose.model('ChatRoom');



/*==========================================
=            ChatRoom Functions            =
==========================================*/

function getChatRooms(req, res) {
  'use strict';

  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'X-Requested-With');

  return ChatRoom.find().sort('id').exec(function(err, data) {
    if (err) return console.error(err);
    return res.send(data);
  });
}

function getChatRoom(req, res) {
  'use strict';

  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'X-Requested-With');

  return ChatRoom.find({
    id: req.params.id
  }).exec(function(err, data) {
    if (err) return console.error(err);
    if (!data.length) res.send(404);
    return res.send(data[0]);
  });
}

function createChatRoom(req, res) {
  'use strict';

  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'X-Requested-With');

  var chatRoom = new ChatRoom();
  chatRoom.save(function(err) {
    if (err) return console.error(err);
    return res.send(chatRoom);
  });
}

function removeChatRoom(req, res) {
  'use strict';

  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'X-Requested-With');

  return ChatRoom.find({
    id: req.params.id
  }).remove().exec(function(err) {
    if(err) return console.error(err);
    return res.send(200);
  });
}



/*=====================================
=            Mongo Routes             =
=====================================*/

mongoServer.get('/chatrooms', getChatRooms);
mongoServer.get('/chatrooms/:id', getChatRoom);
mongoServer.post('/chatrooms', createChatRoom);
mongoServer.del('/chatrooms/:id', removeChatRoom);
mongoServer.listen(mongoPort);



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
      id: room
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
      id: socket.room
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
