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
		
		_selectedRows: null,
		
		_defaultNls: {
			"SORT": "Sort",
			"ASCENDING": "Ascending",
			"DESCENDING": "Descending",
			"SORT_ASCENDING": "Sort Ascending",
			"SORT_DESCENDING": "Sort Descending",
			"CLEAR_SORT": "Clear Sort"
		},
		
		nls: null,
		
//		template: sq_.template(tplStr, {
//			nlsObject: {}
//		}),
		
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
			
			t.rowViews = [];
			t.headEleView = [];
			t.columnsStructure = params["columnsStructure"];
			t.collection = params["collection"];
			t.serverSideSort = params["serverSideSort"];
			t.indirectSort = params["indirectSort"];
			t.canClearState = params["canClearState"];
			t.multiSelect = params["multiSelect"];
			
			t._selectedRows = [];
			t._columnsInfoMap = {};
			var rowContentTplStr = "";
			for(var i = 0; i < t.columnsStructure.length; i++){
				var ci = t.columnsStructure[i];
				t._columnsInfoMap[ci.name] = ci;
				rowContentTplStr += '<td data-sq-grid-col="' + ci.name + '"><%= data.';
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
			t._selectedRows = [];
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
					
					t._selectedRows = [];
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
					
					t._selectedRows = [];
				});
			}
			
			// TODO: Add add, remove logic
			t.listenTo(t.collection, "remove", function(model, collection, options){
				console.log("remove");
				for(var i = 0; i < t.rowViews.length; i++){
					if(t.rowViews[i].model == model){
						t.rowViews.splice(i,1);
						break;
					}
				}
				
				for(var i = 0; i < t._selectedRows.length; i++){
					if(t._selectedRows[i].model == model){
						t._selectedRows.splice(i,1);
						break;
					}
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
					gridView: t,
					nls: {
						"SORT": t.nls["SORT"],
						"ASCENDING": t.nls["ASCENDING"],
						"DESCENDING": t.nls["DESCENDING"],
						"SORT_ASCENDING": t.nls["SORT_ASCENDING"],
						"SORT_DESCENDING": t.nls["SORT_DESCENDING"],
						"CLEAR_SORT": t.nls["CLEAR_SORT"],
					}
				});
				t.$("thead tr").append(ghev.render().$el);
				t.headEleView.push(ghev);
			}
		},
		
//		resetHeadSort: function(){
//			var t = this;
//			t.$(".fa-long-arrow-up").toggleClass("hidden", true);
//			t.$(".fa-long-arrow-down").toggleClass("hidden", true);
//		},
		
		updateHeadSort: function(columnName, sortType){
			var t = this;
			for(var i = 0; i < t.headEleView.length; i++){
				var hev = t.headEleView[i];
				var name = hev.model.get("name");
				var sortable = hev.model.get("sortable");
				if(columnName == name){
					hev.model.set("sortType", sortType);
				}else{
					hev.model.set("sortType", null);
				}
			}
		},
		
		getSelectedRows: function(){
			return this._selectedRows;
		},
		
		clickRow: function(gridRowView, e){
			var t = this;
			var selectedRowsCount = t._selectedRows.length;
			if(t.multiSelect && e.ctrlKey){
				if(gridRowView.model.get("selected")){
					// Deselect Row
					t._deselectSingleRow(gridRowView);
				}else{
					// Select Row
					t._selectSingleRow(gridRowView);
				}
			}else if(t.multiSelect && selectedRowsCount > 1){
				for(var i = 0; i < t.rowViews.length; i++){
					if(t.rowViews[i] == gridRowView){
						// Select Row
						t._selectSingleRow(t.rowViews[i]);
					}else{
						// Deselect Row
						t._deselectSingleRow(t.rowViews[i]);
					}
				}
			}else{
				if(gridRowView.model.get("selected")){
					// Deselect Row
					t._deselectSingleRow(gridRowView);
				}else{
					// Select Row
					for(var i = 0; i < t.rowViews.length; i++){
						if(t.rowViews[i] == gridRowView){
							// Select Row
							t._selectSingleRow(t.rowViews[i]);
						}else{
							// Deselect Row
							t._deselectSingleRow(t.rowViews[i]);
						}
					}
				}
			}
			
			t.trigger("onClickRow");
		},
		
		_selectSingleRow: function(gridRowView){
			var t = this;
			var needAdd= true;
			gridRowView.model.set({"selected": true}, {silent: true});
			gridRowView.$el.toggleClass("sq-row-selected", true);
			
			for(var i = 0; i < t._selectedRows.length; i++){
				if(t._selectedRows[i].model == gridRowView.model){
					needAdd = false;
					break;
				}
			}
			if(needAdd){
				t._selectedRows.push(gridRowView);
				t.trigger("onSelectRow", gridRowView.model);
			}
		},
		
		_deselectSingleRow: function(gridRowView){
			var t = this;
			gridRowView.model.set({"selected": false}, {silent: true});
			gridRowView.$el.toggleClass("sq-row-selected", false);
			for(var i = 0; i < t._selectedRows.length; i++){
				if(t._selectedRows[i].model == gridRowView.model){
					t._selectedRows.splice(i,1);
					t.trigger("onDeselectRow", gridRowView.model);
					break;
				}
			}
		}
	});
})
