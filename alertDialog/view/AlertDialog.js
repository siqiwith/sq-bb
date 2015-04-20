define([
"sq_",
"text!../templates/AlertDialogView.html"
], function(sq_, tplStr, nls) {
	var AlertDialog = Backbone.View.extend({
		tagName: 'div',
		
		className: 'modal fade sq-alert-dialog',
		
		_defaultNls: {
			"OK": "OK",
			"CONFIRM": "Confirm"
		},
		
		nls: null,
		
//		template : sq_.template(tplStr, {
//			nlsObject: {}
//		}),
		
		events: {
			"click button.btn-primary": "submit",
			"click button.btn-default": "hide"
		},
		
		
		initialize: function(params){
			var t = this;
			if(!params){
				params = [];
			}
			
			t.nls = {};
			$.extend(t.nls, t._defaultNls, params["nls"]);
			t.template = sq_.template(tplStr, {
				nlsObject: t.nls
			});
		},
		
		render: function() {
			var t = this;
			t.$el.html(this.template({}));
			t.delegateEvents();
			
			return this;
		},
		
		postRender: function(){
			
		},
		
		loadNls: function(nls){
			var t = this;
			$.extend(t.nls,nls);
			t.template = sq_.template(tplStr, {
				nlsObject: t.nls
			});
			t.render();
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
