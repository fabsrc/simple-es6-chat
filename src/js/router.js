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
    var view = new HomeView();
  }

  chatroom(id) {
    console.log('Route#chatroom', id);
    var view = new ChatRoomView(id);
    $('#app').html(view.render().$el);
  }

}

export default Router;
