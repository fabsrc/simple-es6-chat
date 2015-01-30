class HomeView extends Backbone.View {

  constructor () {
    super();
  }

  render () {
    return _.template($('#home_template'), {});
  }

};

class ChatRoomView extends Backbone.View {

  constructor () {
    super();
  }

  render () {
    return _.template($('#chatroom_template'), {});
  }

};

export default HomeView;
export default ChatRoomView;
