// ChatRoom Model
// ---------------

// Chatroom Model uses REST API.

class ChatRoom extends Backbone.Model {

  constructor(options) {
    super(options);
    this.url = 'http://localhost:8000/chatrooms';
  }

}

export default ChatRoom;
