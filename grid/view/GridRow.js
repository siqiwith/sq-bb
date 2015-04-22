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
		
		_defaultNls: {
		},
		
		nls: null,
		
//		template: sq_.template(tplStr, {
//			nlsObject: {}
//		}),
		
		model: null,
		
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
			
			t.contentTemplate = params["contentTemplate"];
			t.gridView = params["gridView"];
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
				
				var changedAttributes = t.model.changedAttributes();
				
				for(var i = 0; i < columnsStructure.length; i++){
					
					var ci = columnsStructure[i];
					if(ci.forceRender || (changedAttributes && ci.name in changedAttributes)){
						var contentString = rowData[ci.name];
						if(ci.formatter){
							contentString = ci.formatter(rowData[ci.name], t.model, t.$el);	
						}
						t.$('[data-sq-grid-col="' + ci.name + '"]').html(contentString);
//						if(ci.postFormat){
//							ci.postFormat(rowData[ci.name], t.model, t.$el);
//						}
						
						// TODO: Need to remove the setTimeout in the future
						setTimeout(function(){
							if(ci.postFormat){
								ci.postFormat(rowData[ci.name], t.model, t.$el);
							}
						}, 200);
					}
					
//					if(ci.formatter){
//						rowData[ci.name] = ci.formatter(rowData[ci.name], t.model, t.$el);
//					}else{
//						rowData[ci.name] = ci.formatter(rowData[ci.name]);
//					}
				}
				
				//t.$el.html(t.contentTemplate(rowData));
				
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
