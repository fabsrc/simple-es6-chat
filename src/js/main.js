/* global Backbone, io */

// ES6 Chat Application
// ---------------------

// Simple Chat written with ES6 and socket.io

import Router from './router';

class Application {
  constructor() {
    this.router = new Router();
    Backbone.history.start();
  }
}

$(() => {
  'use strict';

  new Application();
  window.socket = io();
});
