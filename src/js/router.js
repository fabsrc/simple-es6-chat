/* jshint expr: true */
/* global Backbone */

import { HomeView, ChatRoomView } from './views';

// Router
// -------

// Backbone Router is extended for routing.


class Router extends Backbone.Router {

  constructor() {

    // Two routes are used:
    // * if no id is specified, the `home` function is called
    // * if a id is specified, the `chatroom` function is called
    this.routes = {
      '': 'home',
      ':id': 'chatroom'
    };

    super();

    // Call `leaveroom` function if browser window is being closed
    $(window).unload(this.leaveRoom);
  }

  // `home` route creates and loads a new HomeView and assigns
  // the global chatRooms collection to it
  home() {
    this.loadView(new HomeView({collection: window.chatRooms}));
  }

  // `chatroom` is looking for a chatroom with the assigned ID:
  // * if no ChatRoom with the ID exists, one gets routed back to home
  // * if ChatRoom with ID exists, socket listener from a previous ChatRoomView
  // is removed, a new ChatRoomView is created and loaded and the `joinRoom`
  // function is called to join a room via socket.io
  chatroom(id) {
    var chatroom = window.chatRooms.find({'id': id});
    if(chatroom) {
      window.socket.removeListener('message');
      this.loadView(new ChatRoomView({model: chatroom}));
      this.joinRoom(chatroom, id);
    } else {
      this.navigate('', true);
    }
  }

  // Remove existing views and assigns a new view, when views are changed
  loadView(view) {
    if(window.room) {
      this.leaveRoom();
    }
    this.view && (this.view.close ? this.view.close() : this.view.remove());
    this.view = view;
    $('#app').html(this.view.$el);
  }

  // Assign id of room to global variable, add user to the chatroom Model
  // and emit a *joinRoom* event with id and username to socket.io server
  joinRoom(chatroom, id) {
    window.room = id;
    chatroom.addUser(window.username);
    window.socket.emit('joinRoom', {room: id, username: window.username});
  }

  // Find current chatroom by id and removes User from it,
  // set global room variable to null and
  // emit a *leaveRoom* event to socket.io server
  leaveRoom() {
    if(window.room) {
      window.chatRooms.find({'id': window.room}).removeUser(window.username);
      window.room = null;
      window.socket.emit('leaveRoom');
    }
  }
}

export default Router;
