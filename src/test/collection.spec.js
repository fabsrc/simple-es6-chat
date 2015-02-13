/* global describe, beforeEach, it, expect */

import ChatRooms from '../js/collections';

describe('ChatRooms spec', function() {
  'use strict';
  var collection;

  beforeEach(function() {
    collection = new ChatRooms();
    collection.add({users: []});
  });

  describe('when collection is created', function() {

    it('should exist', function() {
      expect(collection).toBeDefined();
    });

    it('should have a model', function() {
      expect(collection.models).not.toEqual([]);
    });

  });

});
