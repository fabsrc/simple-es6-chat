
// This Is A Header
// ----------------


// This is a normal comment, that will become part of the
// annotations after running through the Docco tool. Use this
// space to describe the function or other code just below
// this comment. For example:
//
// The `DoSomething` method does something! It doesn't take any
// parameters... it just does something.


import Router from './router';

class Application {
  constructor() {
    this.router = new Router();
    Backbone.history.start();
  }
}

$(() => {
  var app = new Application();
});
