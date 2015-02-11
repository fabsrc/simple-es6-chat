import { HomeView, ChatRoomView } from './views';
import ChatRoom from './models';
import ChatRooms from './collections';


// Router
// -------

// Backbone Router is extended for routing.


class Router extends Backbone.Router {

  constructor() {

    // Only two routes are used:
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
    var that = this;
    var chatRooms = new ChatRooms();
    chatRooms.fetch().success(function() {
      window.socket.emit('leaveRoom');
      that.loadView(new HomeView({ collection: chatRooms }));
    });
  }

  // Specified with an id, a `ChatRoom` is created and fetched from the server
  // If no ChatRoom with the specified id exists, one gets routed back to home
  chatroom(id) {
    var that = this;
    var chatRoom = new ChatRoom({ id: id });
    chatRoom.fetch().success(function() {
      window.socket.removeListener('message');
      window.socket.removeListener('updateUserList');
      window.socket.emit('leaveRoom');
      window.socket.emit('joinRoom', id);
      that.loadView(new ChatRoomView({ model: chatRoom }));
    }).error(function() {
      that.navigate('/', { trigger: true });
    });

  }

  // This function removes views, when views are changed
  loadView(view) {
    this.view && (this.view.close ? this.view.close() : this.view.remove());
    this.view = view;
    $('#app').html(this.view.$el);
  }

}

export default Router;
