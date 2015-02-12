/* global Backbone */

import ChatRoom from './models';

// ChatRoom Collection
// ---------------

// Uses REST API to store and get data.
// ChatRoom Model is required, since this is collection of ChatRooms.

class ChatRooms extends Backbone.Collection {

  constructor(options) {
    super(options);
    this.model = ChatRoom;
    this.url = 'http://localhost:8000/chatrooms';
  }
}

export default ChatRooms;
