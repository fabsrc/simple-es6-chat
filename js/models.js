System.register([],function(t){"use strict";var e;return{setters:[],execute:function(){e=function(t){var e=function s(t){$traceurRuntime.superConstructor(s).call(this,t),this.urlRoot="http://localhost:8000/chatrooms"};return $traceurRuntime.createClass(e,{defaults:function(){return{users:[]}},addUser:function(t){var e=this.get("users");return e.push(t),this.set({users:e}),this.save()},removeUser:function(t){var e=this.get("users");return _.contains(e,t)?(this.set({users:_.without(e,t)}),this.save()):!1}},{},t)}(Backbone.Model),t("default",e)}}});