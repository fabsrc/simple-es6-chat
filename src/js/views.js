/* global Backbone, _ */

// HomeView
// ---------

// HomeView renders all Chatrooms available and lets
// you create new Chatrooms.

class HomeView extends Backbone.View {

  initialize() {
    this.template = $('script[name="home"]').html();

    // Events for the HomeView:
    // * click to create new ChatRoom
    // * click to delete Chat Room
    this.events = {
      'click #newChatRoomButton': 'newChatRoom',
      'click #deleteChatRoomButton': 'deleteChatRoom'
    };

    // Rerenders on all events of the collection:
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

  // New ChatRoom is created with `create` function of the
  // ChatRooms collection. No parameters are assigned
  // *Add* event is only triggered after server responded (`wait: true`)
  newChatRoom() {
    this.collection.create({}, {
      wait: true
    });
    return false;
  }

  // Chatroom is found by id from event target and destroyed with
  // a `DELETE` request to the server
  // *Remove* event is triggerd after server responded (`wait:true`)
  deleteChatRoom(event) {
    var room = this.collection.findWhere({'id': event.target.dataset.id});
    room.destroy({
      wait: true
    });
    return false;
  }
}



// ChatUserListView
// ----------------

// This is a subview of ChatRoomView which renders the UserList

class ChatUserListView extends Backbone.View {

  initialize() {
    this.template = $('script[name="userlist"]').html();
    this.$el = $(this.el);
    this.render();

    // Each time, the model gets changed, that means, when new users
    // are added to the model, the UserList gets rerendered
    this.model.on('change', this.render, this);
  }

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

// ChatRoom view including the chat and the Userlist Subview

class ChatRoomView extends Backbone.View {

  initialize() {
    var that = this;
    this.template = $('script[name="chatroom"]').html();

    // Chat Events:
    // * Send message on submit
    this.events = {
      'submit #sendMessageForm': 'sendMessage'
    };

    // socket.io listener calls addMessage function, if message gets
    // transmitted from socket.io server
    window.socket.on('message', function(username, message) {
      that.addMessage(username, message);
    });

    this.render();

    this.userListView = new ChatUserListView({
      model: this.model,
      el: $('#userlist', that.$el)
    });
  }

  // Send message with socket io and clear input field
  sendMessage() {
    var message = $('#sendMessageInput').val();
    window.socket.emit('message', message);
    this.addMessage(window.username, message);
    $('#sendMessageInput').val('');
    return false;
  }

  // Add message to *messages* and always scroll to the latest message
  addMessage(username, message) {
    $('#messages').append($('<li>')
      .html('<strong>' + username + '</strong>' + '  ' + message));
    $('#messages').scrollTop($('#messages')[0]
      .scrollHeight);
  }

  render() {
    this.$el.html(_.template(this.template)({
      chatRoom: this.model
    }));
    return this;
  }
}

export { HomeView, ChatRoomView };
