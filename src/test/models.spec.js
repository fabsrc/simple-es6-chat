/* global describe, beforeEach, it, expect */

import ChatRoom from '../js/models';

describe('ChatRoom spec', function() {
  'use strict';
  var model;

  beforeEach(function() {
    model = new ChatRoom();
  });

  describe('when model is created', function() {

    it('should exist', function() {
      expect(model).toBeDefined();
    });

    it('should have a user array', function() {
      expect(model.get('users')).toEqual([]);
    });

  });

});
