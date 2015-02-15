/* global describe, it, expect */
/* global Backbone, beforeEach, afterEach, jasmine, spyOn */

import Router from '../js/router';
import ChatRooms from '../js/collections';

describe('Router', function () {
  'use strict';

  var router;

  beforeEach(function() {
    jasmine.getFixtures().set(window.__html__['src/test/fixtures.html']);
    window.socket = {on: function() { return; }, emit: function() { return; }};
    window.chatRooms = new ChatRooms();
    spyOn(Router.prototype, 'home');
    spyOn(Router.prototype, 'chatroom').and.callThrough();
    router = new Router();
    Backbone.history.start();
  });

  afterEach(function() {
    Backbone.history.stop();
  });

  it('has a "home" route', function() {
    expect(router.routes['']).toEqual('home');
  });

  it('has a "chatroom" route', function() {
    expect(router.routes[':id']).toEqual('chatroom');
  });

  it('triggers the "home" route', function () {
    router.navigate('', true);
    expect(Router.prototype.home).toHaveBeenCalled();
  });

  it('triggers the "chatroom" route', function () {
    router.navigate('99', true);
    expect(Router.prototype.chatroom).toHaveBeenCalled();
  });

  it('navigates to "home" if no chatroom exists for id', function () {
    router.navigate('99', true);
    expect(Router.prototype.home).toHaveBeenCalled();
  });
});
