var restify = require('restify'),
    express = require('express'),
    mongoose = require('mongoose');


/*=============================
=            Ports            =
=============================*/

var httpPort = 3000;
var mongoPort = 8080;



/*====================================
=            Mongo Server            =
====================================*/

var mongoServer = restify.createServer();
mongoServer.use(restify.bodyParser());
db = mongoose.connect('mongodb://localhost/chat');



/*====================================
=            Mongo Models            =
====================================*/

var ChatRoomSchema = new mongoose.Schema({
  title: String,
  users: Array
});
mongoose.model('ChatRoom', ChatRoomSchema);
var ChatRoom = mongoose.model('ChatRoom');

var UserSchema = new mongoose.Schema({
  name: String
});
mongoose.model('User', UserSchema);
var User = mongoose.model('User');



/*==========================================
=            ChatRoom Functions            =
==========================================*/

function getChatRooms(req, res, next) {
  'use strict';

  ChatRoom.find().exec(function(arr, data) {
    res.send(data);
  });
}


function createChatRoom(req, res, next) {
  'use strict';

  var chatRoom = new ChatRoom();
  chatRoom.title = req.params.title;
  chatRoom.save(function() {
    res.send(req.body);
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
  socket.emit('news', { hello: 'world' });
  socket.on('myevent', function(data) {
    console.log(data);
  });
});






