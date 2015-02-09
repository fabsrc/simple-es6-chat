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

function getChatRooms(req, res, next) {
  'use strict';

  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'X-Requested-With');

  ChatRoom.find().exec(function(arr, data) {
    res.send(data);
  });
}


function createChatRoom(req, res, next) {
  'use strict';

  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'X-Requested-With');

  var chatRoom = new ChatRoom();
  chatRoom.save(function(err) {
    if(err) console.error(err);
    res.send('Successfully created!');
  });
}



/*=====================================
=            Mongo Routes             =
=====================================*/


mongoServer.get('/chatrooms', getChatRooms);
mongoServer.post('/chatrooms', createChatRoom);
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

  socket.on('joinRoom', function(room){
    // store the username in the socket session for this client
    socket.username = socket.username || faker.name.firstName();
    // store the room name in the socket session for this client
    socket.room = room;
    // add the client's username to the global list
    ChatRoom.update(
      { id: room },
      { $push: { users: socket.username } },
      {}, function(a,b) {
    });
    // send client to room 1
    socket.join(room);
    // echo to client they've connected
    socket.emit('message', 'SERVER', 'you have connected to room ' + room);
    // echo to room 1 that a person has connected to their room
    socket.broadcast.to(socket.room).emit('message', 'SERVER',
      socket.username + ' has connected to this room');
    //socket.emit('updaterooms', rooms, 'room1');
  });

  socket.on('leaveRoom', function() {

    // Emit message to current room
    socket.broadcast.to(socket.room).emit('message', 'SERVER',
      socket.username + ' has left this room');

    // Leave room
    socket.leave(socket.room);

    // Remove username from room's userlist
    ChatRoom.update(
      { id: socket.room },
      { $pull: { users: socket.username } },
      {}, function(a,b) {
    });

    // Set current room to null
    socket.room = null;

  });

  socket.on('message', function(msg){
    console.log(msg);
    io.sockets.in(socket.room).emit('message', socket.username, msg);
  });
});






