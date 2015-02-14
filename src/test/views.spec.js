/* global describe, beforeEach, it, expect, jasmine */

import ChatRooms from '../js/collections';
import ChatRoom from '../js/models';
import { HomeView, ChatRoomView } from '../js/views';



describe('HomeView spec', function() {
  'use strict';
  var view, collection;

  beforeEach(function() {
    jasmine.getFixtures().set(window.__html__['src/test/fixtures.html']);
    collection = new ChatRooms();
    collection.add({id: 9999, users: []});
    view = new HomeView({collection: collection});
  });

  describe('when view is constructing', function() {

    it('should exist', function() {
      expect(view).toBeDefined();
    });

  });
});

describe('ChatRoomView spec', function() {
  'use strict';
  var view, model;

  beforeEach(function() {
    jasmine.getFixtures().set(window.__html__['src/test/fixtures.html']);
    window.socket = {on: function() { return; }};
    model = new ChatRoom({id: 999, users: ['USER']});
    view = new ChatRoomView({model: model});
  });

  describe('when view is constructing', function() {

    it('should exist', function() {
      expect(view).toBeDefined();
    });

  });
});
