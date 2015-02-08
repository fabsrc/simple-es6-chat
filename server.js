var restify = require('restify'),
    express = require('express'),
    mongoose = require('mongoose'),
    autoIncrement = require('mongoose-auto-increment');


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

  socket.emit('news', { hello: 'world' });
  socket.on('myevent', function(data) {
    console.log(data);
  });
});






