define([
"sq_",
"text!../templates/MaskView.html"
], function(sq_, tplStr){
	return Backbone.View.extend({
		tagName: 'div',
		
		className: 'sq-mask hidden',
		
		target: null,
		
		text: '',
		
		template: sq_.template(tplStr, {
			nlsObject: {}
		}),
		
		initialize: function(params){
			var t = this;
			t.target = params["target"];
			t.text = params["text"];
		},
		
		remove: function(){
			t.target = null;
			Backbone.View.prototype.remove.apply(this, arguments);
		},
		
		render: function(){
			var t = this;
			t.$el.html(this.template({}));
			return this;
		},
		
		show: function(){
			var t = this;
			if(t._showing){
				return;
			}
			
			if(t._resizeHandler){
				$(window).off('resize', t._resizeHandler)
				t._resizeHandler = null;
			}
			
			t._resizeHandler = function(e){
				t.resize();
			};
			$(window).on('resize', t._resizeHandler);
			
			t._showing = true;
			
			t.$el.removeClass("hidden");
			t.resize();
		},
		
		hide: function(){
			var t = this;
			t.$el.addClass("hidden");
			if(t._resizeHandler){
				$(window).off('resize', t._resizeHandler)
				t._resizeHandler = null;
			}
			t._showing = false;
		},
		
		resize: function(){
			var t = this;
			var offset = $(t.target).offset();
			t.$el.offset(offset);
			t.$el.css({
				"width": $(t.target).css("width"),
				"height": $(t.target).css("height"),
			});
			t.$('.sq-mask-text-container span').html(t.text);
		},
		
		setText: function(text){
			this.text = text;
		}
	});
})
