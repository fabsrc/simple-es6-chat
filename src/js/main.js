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



// On document ready event, do the following and start the application
$(() => {
  'use strict';

  // Connection to *socket.io*
  window.socket = io();

  // Create global *chatRooms* Collection
  window.chatRooms = new ChatRooms();

  // Get random username from random name generator on Server and assign it
  // to a global variable
  $.ajax({
    url: 'http://localhost:8000/randomname',
    async: false,
    success: function(data) {
      window.username = data.firstname;
    }
  });

  // socket.io listener for userlist updates is created, if triggered, the
  // ChatRooms collection will be refetched
  window.socket.on('updateUserList', function() {
    window.chatRooms.fetch({
      data: {
        sort: '_id'
      }
    });
  });

  // Before starting the application, the ChatRooms collection is fetched once
  window.chatRooms.fetch({
    data: {
      sort: '_id'
    }
  }).done(function() {
    new Application();
  });
});
