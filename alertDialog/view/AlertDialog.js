define([
"sq_",
"text!../templates/AlertDialogView.html"
], function(sq_, tplStr, nls) {
	var AlertDialog = Backbone.View.extend({
		tagName: 'div',
		
		className: 'modal fade sq-alert-dialog',
		
		template : sq_.template(tplStr, {
			nlsObject: {}
		}),
		
		events: {
			"click button.btn-primary": "submit",
			"click button.btn-default": "hide"
		},
		
		
		render: function() {
			var t = this;
			t.$el.html(this.template({}));
			t.delegateEvents();
			
			return this;
		},
		
		postRender: function(){
			
		},
		
		_update: function(data){
			var t = this;
			t.$el.html(this.template(data));
			t.delegateEvents();
			
			return this;
		},
		
		show: function(content){
			var t = this
			t._update({
				title: content.title,
				text: content.text,
				type: content.type,
				description: content.description
			});
			$(".sq-alert-dialog").modal({
				show: true,
				backdrop: "static"
			});
		},
		
		hide: function(){
			var t = this;
		},
		
		submit: function(){
			
		}
	});
	
	var alertDialog = new AlertDialog;
	$(function(){
		$("body").append(alertDialog.render().el);
	});
	
	return alertDialog;
})
