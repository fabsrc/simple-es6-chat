import ChatRooms from './collections';
import ChatRoom from './models';

// HomeView
// ---------

// HomeView renders all Chatrooms available and lets
// you create new Chatrooms.


class HomeView extends Backbone.View {

  initialize() {
    this.template = $('script[name="home"]').html();
    this.getChatRooms();

    // Events for the HomeView.
    this.events = {
      'click #newChatRoomButton': 'newChatRoom'
    };
  }

  render() {
    console.log('render');
    this.$el.html(_.template(this.template)
      ({ chatRooms: this.collection.models }));
    this.delegateEvents();
    return this;
  }

  getChatRooms() {
    var that = this;
    this.collection = new ChatRooms();
    this.collection.fetch().done(function() {
      that.render();
    });
  }

  newChatRoom() {
    var that = this;
    var chatRoom = new ChatRoom();
    chatRoom.save().done(function() {
      that.getChatRooms();
    });
  }

}


// ChatRoomView
// -------------

// Base on the ID, a Chatroom is loaded and rendered.
// ...


class ChatRoomView extends Backbone.View {

  initialize(id) {
    this.template = $('script[name="chatroom"]').html();
    this.getChatRoom(id);
    this.id = id;


    this.events = {
      'submit #sendMessageForm': 'sendMessage'
    };

    app.socket.on('message', function(username, msg){
      $('#messages').append($('<li>').text(username +': ' + msg));
    });
  }

  getChatRoom() {
    var that = this;
    this.collection = new ChatRooms();
    this.collection.fetch().done(function() {
      that.model = that.collection.get(that.id);
      that.render();
    });
  }

  sendMessage() {
    app.socket.emit('message', $('#sendMessageInput').val());
    $('#sendMessageInput').val('');
    return false;
  }

  render() {
    this.$el.html(_.template(this.template)({ chatRoom: this.model }));
    return this;
  }

}

export { HomeView, ChatRoomView };
