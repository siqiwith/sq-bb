define([
"sq_",
"text!../templates/GridRow.html"
], function(sq_, tplStr){
	return Backbone.View.extend({
		tagName: 'tr',
		
		className: 'sq-grid-row',
		
		events: {
			"click": "onClick"
		},
		
		template: sq_.template(tplStr, {
			nlsObject: {}
		}),
		
		model: null,
		
		initialize: function(params){
			this.contentTemplate = params["contentTemplate"];
			this.gridView = params["gridView"];
		},
		
		remove: function(){
			this.contentTemplate = null;
			this.gridView = null;
			Backbone.View.prototype.remove.apply(this, arguments);
		},
		
		render: function(columnsStructure){
			var t = this;
			var rowData = t.model.toJSON();
			
			for(var i = 0; i < columnsStructure.length; i++){
				var ci = columnsStructure[i];
				if(ci.formatter){
					rowData[ci.name] = ci.formatter(rowData[ci.name], t.model);
				}
			}
			
			
			t.$el.html(t.contentTemplate(rowData));
			if(this.model.get("selected")){
				t.$el.toggleClass("sq-row-selected", true);
			}else{
				t.$el.toggleClass("sq-row-selected", false);
			}
			
			
			t.listenTo(t.model, "change", function(model, options){
				console.log(arguments);
				var rowData = t.model.toJSON();
				
				for(var i = 0; i < columnsStructure.length; i++){
					var ci = columnsStructure[i];
					if(ci.formatter){
						rowData[ci.name] = ci.formatter(rowData[ci.name], t.model);
					}
				}
				
				t.$el.html(t.contentTemplate(rowData));
				
				if(this.model.get("selected")){
					t.$el.toggleClass("sq-row-selected", true);
				}else{
					t.$el.toggleClass("sq-row-selected", false);
				}
			});
			
			return this;
		},
		
		onClick: function(e){
			this.gridView.clickRow(this, e);
		}
	});
})
