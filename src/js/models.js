/* global Backbone, _ */

// ChatRoom Model
// ---------------

// Simple ChatRoom model extends from Backbone Model
// Uses REST to get data from server

class ChatRoom extends Backbone.Model {

  defaults() {
    return {
      users: []
    };
  }

  constructor(options) {
    super(options);
    this.urlRoot = 'http://localhost:8000/chatrooms';
  }

  // Add user to users array and sync with server
  addUser(username) {
    var users = this.get('users');
    users.push(username);
    this.set({
      'users': users
    });
    return this.save();
  }

  // Remove user from users array and sync with server
  removeUser(username) {
    var users = this.get('users');
    if( _.contains(users, username) ) {
      this.set({
        'users':  _.without(users, username)
      });
      return this.save();
    }
    return false;
  }
}

export default ChatRoom;
