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
    var chatRoom = window.chatRooms.find({'id': id});
    if(chatRoom) {
      window.socket.removeListener('message');
      this.loadView(new ChatRoomView({model: chatRoom}));
      this.joinRoom(id);
    } else {
      this.navigate('/', {
        trigger: true
      });
    }
  }

  // Removes existing views and assigns a new view, when views are changed
  loadView(view) {
    this.leaveRoom();
    this.view && (this.view.close ? this.view.close() : this.view.remove());
    this.view = view;
    $('#app').html(this.view.$el);
  }

  // Emmits a *joinRoom* event with an ID to socket.io server
  joinRoom(id) {
    window.socket.emit('joinRoom', id);
  }

  // Emmits a *leaveRoom* event to socket.io server
  leaveRoom() {
    window.socket.emit('leaveRoom');
  }
}

export default Router;
