define([
"sq_",
"sqGrid/view/GridHeadEle",
"sqGrid/view/GridRow",
"sqGrid/model/GridHeadEle",
"text!../templates/GridView.html"
], function(sq_, GridHeadEleView, GridRowView, GridHeadEleModel, tplStr){
	return Backbone.View.extend({
		tagName: 'table',
		
		className: 'table table-striped table-hover sq-grid',
		
		headEleView: null,
		
		rowViews: null,
		
		template: sq_.template(tplStr, {
			nlsObject: {}
		}),
		
		initialize: function(params){
			var t = this;
			t.rowViews = [];
			t.headEleView = [];
			t.columnsStructure = params["columnsStructure"];
			t.collection = params["collection"];
			t.serverSideSort = params["serverSideSort"];
			t.indirectSort = params["indirectSort"];
			
			t._columnsInfoMap = {};
			var rowContentTplStr = "";
			for(var i = 0; i < t.columnsStructure.length; i++){
				var ci = t.columnsStructure[i];
				t._columnsInfoMap[ci.name] = ci;
				rowContentTplStr += '<td><%= data.';
				rowContentTplStr += ci.name;
				rowContentTplStr += ' %></td>';
			}
			
			t.rowContentTemplate = sq_.template(rowContentTplStr, {
				nlsObject: {}
			});
			
		},
		
		remove: function(){
			var rowViews = this.rowViews;
			if(rowViews){
				for(var i = 0; i < rowViews.length; i++){
					rowViews[i].remove();
				}
			}
			var headEleView = this.headEleView;
			if(headEleView){
				for(var i = 0; i < headEleView.length; i++){
					headEleView[i].remove();
				}
			}
			
			Backbone.View.prototype.remove.apply(this, arguments);
		},
		
		render: function(){
			var t = this;
			t.$el.html(this.template({}));
			// Render Header
			t.renderHead();
			
//			t.listenTo(t.collection, "add", function(model, collection, options){
//				var gridRowView = new GridRowView({
//					model: model,
//					contentTemplate: t.rowContentTemplate
//				});
//				t.rowViews.push[gridRowView];
//				t.$("tbody").append(gridRowView.render().$el);
//			});
			if(t.serverSideSort){
				t.listenTo(t.collection, "reset", function(collection, options){
					console.log();
					while(t.rowViews.length > 0){
						var rv = t.rowViews.pop();
						rv.remove();
					}
					
					t.collection.each(function(model){
						var gridRowView = new GridRowView({
							model: model,
							gridView: t,
							contentTemplate: t.rowContentTemplate
						});
						t.rowViews.push(gridRowView);
						t.$("tbody").append(gridRowView.render(t.columnsStructure).$el);
					});
					
					t.trigger("onRedraw");
				});
			}else{
				// TODO: Check what event should be bind to if serverSideSort = false
				t.listenTo(t.collection, "sort", function(collection, options){
					console.log("sort");
					while(t.rowViews.length > 0){
						var rv = t.rowViews.pop();
						rv.remove();
					}
					
					t.collection.each(function(model){
						var gridRowView = new GridRowView({
							model: model,
							gridView: t,
							contentTemplate: t.rowContentTemplate
						});
						t.rowViews.push(gridRowView);
						t.$("tbody").append(gridRowView.render(t.columnsStructure).$el);
					});
				});
			}
			t.listenTo(t.collection, "remove", function(model, collection, options){
				console.log("remove");
				for(var i = 0; i < t.rowViews.length; i++){
					if(t.rowViews[i].model == model){
						t.rowViews.splice(i,1)
					}
					return;
				}
			});
			
			t.listenTo(t.collection, "change", function(model, options){
				console.log("change");
			});
			
			t.listenTo(t.collection, "reset", function(model, options){
				console.log("reset");
			});
			 
			return this;
		},
		
		renderHead: function(){
			var t = this;
			var cs = t.columnsStructure;
			for(var i = 0; i < cs.length; i++){
				var ci = cs[i];
				ci.id = i;
				var ghem = new GridHeadEleModel(ci);
				var ghev = new GridHeadEleView({
					model: ghem,
					gridView: t
				});
				t.$("thead tr").append(ghev.render().$el);
				t.headEleView.push(ghev);
			}
		},
		
		resetHeadSort: function(){
			var t = this;
			t.$(".fa-long-arrow-up").toggleClass("hidden", true);
			t.$(".fa-long-arrow-down").toggleClass("hidden", true);
		},
		
		selectRow: function(gridRowView){
			var t = this;
			for(var i = 0; i < t.rowViews.length; i++){
				if(t.rowViews[i] == gridRowView){
					t.rowViews[i].model.set({"selected": true}, {silent: true});
					t.rowViews[i].$el.toggleClass("sq-row-selected", true);
				}else{
					t.rowViews[i].model.set({"selected": false}, {silent: true});
					t.rowViews[i].$el.toggleClass("sq-row-selected", false);
				}
			}
		}
	});
})
