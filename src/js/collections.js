/* global Backbone */

import ChatRoom from './models';

// ChatRooms Collection
// --------------------

// Stores all ChatRooms and uses REST API to store and get data from Server
// Model `ChatRoom` is required for association
// To get data from Server, the `fetch` function is used.

class ChatRooms extends Backbone.Collection {

  constructor(options) {
    super(options);
    this.model = ChatRoom;
    this.url = 'http://localhost:8000/chatrooms';
  }
}

export default ChatRooms;
