/* global Backbone, io */

// ES6 Chat Application
// ---------------------

// **Simple Chat written with ES6**
// *Uses Backbone for structuring and socket.io and REST for communication*
//

import Router from './router';
import ChatRooms from './collections';


// Main Application class, creates router and starts Backbone history
class Application {
  constructor() {
    new Router();
    Backbone.history.start();
  }
}


// Connection to socket.io and global ChatRooms collection are created
// socket.io listener for userlist updates is created, if triggered, the
// ChatRooms collection will be refetched
// Before starting the application, the ChatRooms collection is fetched once
$(() => {
  'use strict';

  window.socket = io();
  window.chatRooms = new ChatRooms();

  window.socket.on('updateUserList', function() {
    window.chatRooms.fetch();
  });

  window.chatRooms.fetch().done(function() {
    new Application();
  });
});
