/* global Backbone, _ */

// HomeView
// ---------

// HomeView renders all Chatrooms available and lets
// you create new Chatrooms.

class HomeView extends Backbone.View {

  initialize() {
    this.template = $('script[name="home"]').html();

    // Events for the HomeView.
    this.events = {
      'click #newChatRoomButton': 'newChatRoom'
    };

    // Rerender if new chatroom is added or if any user joined room
    this.collection.on('all', this.render, this);

    this.render();
  }

  render() {
    this.$el.html(_.template(this.template)
      ({
        chatRooms: this.collection.models
      }));
    this.delegateEvents();
    return this;
  }

  newChatRoom() {
    this.collection.create({}, {
      wait: true
    });
    return false;
  }

}



// ChatUserListView
// ----------------

// This is a subview of ChatRoomView

class ChatUserListView extends Backbone.View {

  // Initialize View
  initialize() {
    this.template = $('script[name="userlist"]').html();
    this.$el = $(this.el);
    this.render();

    this.model.on('change', this.render, this);
  }

  // Render View
  render() {
    this.$el.html(_.template(this.template)
      ({
        users: this.model.get('users')
      }));
    return this;
  }
}



// ChatRoomView
// -------------

// ChatRoom view including chat and subview Userlist
// ...

class ChatRoomView extends Backbone.View {

  initialize() {
    var that = this;
    this.template = $('script[name="chatroom"]').html();

    this.events = {
      'submit #sendMessageForm': 'sendMessage'
    };

    window.socket.on('message', function(username, message) {
      that.addMessage(username, message);
    });

    this.render();
    this.userListView = new ChatUserListView({
      model: this.model,
      el: $('#userlist', that.$el)
    });
  }

  // Send message with socket io
  sendMessage() {
    window.socket.emit('message', $('#sendMessageInput').val());
    $('#sendMessageInput').val('');
    return false;
  }

  addMessage(username, message) {
    $('#messages').append($('<li>')
      .html('<strong>' + username + '</strong>' + '  ' + message));
    $('#messages').scrollTop($('#messages')[0]
      .scrollHeight);
  }

  // Render View
  render() {
    this.$el.html(_.template(this.template)({
      chatRoom: this.model
    }));
    return this;
  }
}

export { HomeView, ChatRoomView };
