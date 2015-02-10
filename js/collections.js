import ChatRoom from './models';

// ChatRoom Collection
// ---------------

// Uses ChatRoom Model and REST API.

class ChatRooms extends Backbone.Collection {

  constructor(options) {
    super(options);
    this.model = ChatRoom;
    this.url = 'http://localhost:8000/chatrooms';
  }

}

export default ChatRooms;
