System.register([],function(e){"use strict";var t,s,n;return{setters:[],execute:function(){t=function(e){var t=function s(){$traceurRuntime.superConstructor(s).apply(this,arguments)};return $traceurRuntime.createClass(t,{initialize:function(){this.template=$('script[name="home"]').html(),this.events={"click #newChatRoomButton":"newChatRoom","click #deleteChatRoomButton":"deleteChatRoom"},this.collection.on("all",this.render,this),this.render()},render:function(){return this.$el.html(_.template(this.template)({chatRooms:this.collection.models})),this.delegateEvents(),this},newChatRoom:function(){return this.collection.create({},{wait:!0}),!1},deleteChatRoom:function(e){var t=this.collection.findWhere({id:e.target.dataset.id});return t.destroy({wait:!0}),!1}},{},e)}(Backbone.View),s=function(e){var t=function s(){$traceurRuntime.superConstructor(s).apply(this,arguments)};return $traceurRuntime.createClass(t,{initialize:function(){this.template=$('script[name="userlist"]').html(),this.$el=$(this.el),this.render(),this.model.on("change",this.render,this)},render:function(){return this.$el.html(_.template(this.template)({users:this.model.get("users")})),this}},{},e)}(Backbone.View),n=function(e){var t=function n(){$traceurRuntime.superConstructor(n).apply(this,arguments)};return $traceurRuntime.createClass(t,{initialize:function(){var e=this;this.template=$('script[name="chatroom"]').html(),this.events={"submit #sendMessageForm":"sendMessage"},window.socket.on("message",function(t,s){e.addMessage(t,s)}),this.render(),this.userListView=new s({model:this.model,el:$("#userlist",e.$el)})},sendMessage:function(){return window.socket.emit("message",$("#sendMessageInput").val()),$("#sendMessageInput").val(""),!1},addMessage:function(e,t){$("#messages").append($("<li>").html("<strong>"+e+"</strong>  "+t)),$("#messages").scrollTop($("#messages")[0].scrollHeight)},render:function(){return this.$el.html(_.template(this.template)({chatRoom:this.model})),this}},{},e)}(Backbone.View),e("HomeView",t),e("ChatRoomView",n)}}});