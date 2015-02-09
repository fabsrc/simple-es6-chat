import { HomeView, ChatRoomView } from './views';

class Router extends Backbone.Router {

  constructor() {
    this.routes = {
      '': 'home',
      ':id': 'chatroom'
    };
    app.socket = io();
    super();
  }

  home() {
    console.log('Route#home');
    this.loadView(new HomeView());
  }

  chatroom(id) {
    console.log('Route#chatroom', id);
    app.socket.removeListener('message');
    this.loadView(new ChatRoomView(id));
    app.socket.emit('joinRoom', id);
  }

  loadView(view) {
    this.view && (this.view.close ? this.view.close() : this.view.remove());
    this.view = view;
    app.socket.emit('leaveRoom');
    $('#app').html(this.view.$el);
  }

}

export default Router;
