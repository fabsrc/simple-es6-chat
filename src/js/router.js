import { HomeView, ChatRoomView } from './views';
import ChatRoom from './models';

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
    var that = this;
    var chatRoom = new ChatRoom({ id: id });
    chatRoom.fetch().done(function() {
      app.socket.removeListener('message');
      app.socket.emit('joinRoom', id);
      that.loadView(new ChatRoomView(id));
    }).error(function() {
      that.navigate('/');
    });

  }

  loadView(view) {
    app.socket.emit('leaveRoom');
    this.view && (this.view.close ? this.view.close() : this.view.remove());
    this.view = view;
    $('#app').html(this.view.$el);
  }

}

export default Router;
