/* global Backbone */

// ChatRoom Model
// ---------------

// Chatroom Model uses REST API to store and get data.

class ChatRoom extends Backbone.Model {

  constructor(options) {
    super(options);
    this.urlRoot = 'http://localhost:8000/chatrooms';
  }

}

export default ChatRoom;
