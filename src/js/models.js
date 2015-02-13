/* global Backbone */

// ChatRoom Model
// ---------------

// Simple ChatRoom model extends from Backbone Model
// Uses REST to get data from server

class ChatRoom extends Backbone.Model {

  constructor(options) {
    super(options);
    this.urlRoot = 'http://localhost:8000/chatrooms';
  }
}

export default ChatRoom;
