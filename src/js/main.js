/* global Backbone, io */

// ES6 Chat Application
// ---------------------

// Simple Chat written with ES6 and socket.io

import Router from './router';
import ChatRooms from './collections';

class Application {
  constructor() {
    this.router = new Router();
    Backbone.history.start();
  }
}

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
