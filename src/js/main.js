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

  // Connection to *socket.io* in global scope
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

  // socket.io listener for data updates is created, if triggered, the
  // ChatRooms collection will be refetched
  window.socket.on('updateData', function() {
    window.chatRooms.fetch({
      data: {
        sort: '_id'
      }
    });
  });

  // Before creating a new router, the ChatRooms collection is fetched once
  window.chatRooms.fetch({
    data: {
      sort: '_id'
    }
  }).done(function() {
    new Router();
    Backbone.history.start();
  });
  }
}

// On document ready event, start the Application
$(() => {
  'use strict';

    new Application();
});
