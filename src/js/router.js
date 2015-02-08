import { HomeView, ChatRoomView } from './views';

class Router extends Backbone.Router {

  constructor() {
    this.routes = {
      '': 'home',
      ':id': 'chatroom'
    };
    super();
  }

  home() {
    console.log('Route#home');
    this.loadView(new HomeView());
  }

  chatroom(id) {
    console.log('Route#chatroom', id);
    this.loadView(new ChatRoomView());
  }

  loadView(view) {
    this.view && (this.view.close ? this.view.close() : this.view.remove());
    this.view = view;
    $('#app').html(this.view.$el);
  }

}

export default Router;
