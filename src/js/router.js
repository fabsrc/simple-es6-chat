/* jshint expr: true */
/* global Backbone */

import { HomeView, ChatRoomView } from './views';

// Router
// -------

// Backbone Router is extended for routing.


class Router extends Backbone.Router {

  constructor() {

    // Two routes are used:
    // if no id is specified, the `home` function is called
    // if a id is specified, the `chatroom` function is called
    this.routes = {
      '': 'home',
      ':id': 'chatroom'
    };
    super();
  }

  // A `ChatRooms` collection is created and data is fetched from the server
  home() {
    this.loadView(new HomeView({collection: window.chatRooms}));
  }

  // Specified with an id, a `ChatRoom` is received from the collection
  // If no ChatRoom with the specified id exists, one gets routed back to home
  chatroom(id) {
    var chatRoom = window.chatRooms.find({id: +id});
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

  // Removes views, when views are changed
  loadView(view) {
    this.leaveRoom();
    this.view && (this.view.close ? this.view.close() : this.view.remove());
    this.view = view;
    $('#app').html(this.view.$el);
  }

  joinRoom(id) {
    window.socket.emit('joinRoom', id);
  }

  leaveRoom() {
    window.socket.emit('leaveRoom');
  }
}

export default Router;
