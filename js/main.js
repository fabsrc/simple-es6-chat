System.register(["./router"],function(){"use strict";var t,e;return{setters:[function(e){t=e["default"]}],execute:function(){e=function(){var e=function(){this.router=new t,Backbone.history.start()};return $traceurRuntime.createClass(e,{},{})}(),$(function(){new e;window.socket=io()})}}});