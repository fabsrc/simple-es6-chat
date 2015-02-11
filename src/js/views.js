import ChatRooms from './collections';
import ChatRoom from './models';


function helloWorld() {
  console.log('Hello world!');
}

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

  // Initialize with the id
  initialize(id) {
    this.template = $('script[name="chatroom"]').html();
    this.id = id;
    this.getChatRoom();


    this.events = {
      'submit #sendMessageForm': 'sendMessage'
    };

    app.socket.on('message', function(username, msg){
      $('#messages').append($('<li>').text(username +': ' + msg));
    });
  }

  // Get and fetch chatroom
  getChatRoom() {
    var that = this;
    this.model = new ChatRoom({id: this.id});
    this.model.fetch().done(function() {
      that.render();
    });
  }

  // Send message with socket io
  sendMessage() {
    app.socket.emit('message', $('#sendMessageInput').val());
    $('#sendMessageInput').val('');
    return false;
  }

  // Render View
  render() {
    this.$el.html(_.template(this.template)({ chatRoom: this.model }));
    this.userListView = new ChatUserListView({ model: this.model });

    return this;
  }

}


class ChatUserListView extends Backbone.View {

  // Initialize View
  initialize() {
    console.log(this);
    var that = this;
    this.template = $('script[name="userlist"]').html();

    app.socket.on('userJoined', function() {
      console.log("userJoined");
      that.render();
    });
  }

  // Render View
  render() {
    console.log(this);
    var that = this;
    this.model.fetch().done(function() {
      that.$el.html(_.template(that.template)({ users: that.model.get('users') }));
      $('#userlist').html(that.$el);
      return this;
    });
  }
}

export { HomeView, ChatRoomView };
