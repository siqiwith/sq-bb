define([
"sq_",
"text!../templates/GridHeadEle.html"
], function(sq_, tplStr){
	return Backbone.View.extend({
		tagName: 'th',
		
		className: 'sq-grid-head-el',
		
		events: {
			"click .sq-sort-dropdown-button .dropdown-menu li": "indirectSort",
			"click": "sort"
		},
		
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
		
		model: null,
		
		defaultComparator: null,
		
		_currentSortType: null,
		
		_indirectSortEnabled: false,
		
		_canClearState: false,
		
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
			
			t.gridView = params["gridView"];
			t.defaultComparator = t.gridView.collection.comparator;
			t.ascComparator = function(a, b){
				var valA = a.get(t.model.get("name"));
				var valB = b.get(t.model.get("name"));
				if(valA == valB){
					return 0;
				}else if(valA > valB){
					return 1;
				}else{
					return -1;
				}
			};
			
			t.descComparator = function(a, b){
				var valA = a.get(t.model.get("name"));
				var valB = b.get(t.model.get("name"));
				if(valA == valB){
					return 0;
				}else if(valA < valB){
					return 1;
				}else{
					return -1;
				}
			};
			
			t._indirectSortEnabled = t.gridView.indirectSort ? t.gridView.indirectSort.enabled : false;
			t._canClearState = t.gridView.canClearState;
			t.model.set("indirectSort", t._indirectSortEnabled);
		},
		
		render: function(){
			var t = this;
			t.$el.html(t.template(t.model.toJSON()));
			var sortable = t.model.get("sortable");
			// indirect sort can only be set before grid is created.
			if(!t._indirectSortEnabled && sortable){
				t.$el.css({"cursor": "pointer"});
			}
			
			t.listenTo(t.model, "change", function(model, options){
				console.log(arguments);
				t.$el.html(t.template(t.model.toJSON()));
				// indirect sort can only be set before grid is created.
				if(!t._indirectSortEnabled){
					t.$el.css({"cursor": "pointer"});
				}
			});
			return t;
		},
		
		sort: function(e){
			var t = this;
			if(t._indirectSortEnabled){
				return;
			}
			
			var ct = e.currentTarget;
			
			var name = t.model.get("name");
			var sortable = t.model.get("sortable");
			if(!sortable){
				return;
			}
			
			var pn = $(ct).parent().parent();
			
			
			var currentSortType = t.model.get("sortType");
			if(currentSortType == "ascending"){
				if(t._canClearState){
					t.gridView.updateHeadSort(name, null);
					if(t.gridView.serverSideSort){
						t.gridView.trigger("onServerSideSort", {
							sortBy: name,
							sortType: "clear"
						});
					}else{
						t.gridView.collection.comparator = t.defaultComparator;
						// TODO: Clear sort is not working when serverSideSort = false 
						t.gridView.collection.sort();
					}
				}else{
					t.gridView.updateHeadSort(name, "descending");
					if(t.gridView.serverSideSort){
						t.gridView.trigger("onServerSideSort", {
							sortBy: name,
							sortType: "descending"
						});
					}else{
						t.gridView.collection.comparator = t.descComparator;
						t.gridView.collection.sort();
					}
				}
			}else if(currentSortType == "descending"){
				t.gridView.updateHeadSort(name, "ascending");
				if(t.gridView.serverSideSort){
					t.gridView.trigger("onServerSideSort", {
						sortBy: name,
						sortType: "ascending"
					});
				}else{
					t.gridView.collection.comparator = t.ascComparator;
					t.gridView.collection.sort();
				}
			}else{
				t.gridView.updateHeadSort(name, "descending");
				if(t.gridView.serverSideSort){
					t.gridView.trigger("onServerSideSort", {
						sortBy: name,
						sortType: "descending"
					});
				}else{
					t.gridView.collection.comparator = t.descComparator;
					t.gridView.collection.sort();
				}
			}
		},
		
		indirectSort: function(e){
			var t = this;
			var ct = e.currentTarget;
			
			var name = t.model.get("name");
			
			var pn = $(ct).parent().parent().parent();
			var sortType = t.$(ct).attr("data-sq-sort-type");
			
			if(sortType == "asc"){
				t.gridView.updateHeadSort(name, "ascending");
				if(t.gridView.serverSideSort){
					t.gridView.trigger("onServerSideSort", {
						sortBy: name,
						sortType: "ascending"
					});
				}else{
					t.gridView.collection.comparator = t.ascComparator;
					t.gridView.collection.sort();
				}
				
			}else if(sortType == "desc"){
				t.gridView.updateHeadSort(name, "descending");
				if(t.gridView.serverSideSort){
					t.gridView.trigger("onServerSideSort", {
						sortBy: name,
						sortType: "descending"
					});
				}else{
					t.gridView.collection.comparator = t.descComparator;
					t.gridView.collection.sort();
				}

			}else{
				t.gridView.updateHeadSort(name, null);
				if(t.gridView.serverSideSort){
					t.gridView.trigger("onServerSideSort", {
						sortBy: name,
						sortType: "clear"
					});
				}else{
					t.gridView.collection.comparator = t.defaultComparator;
					// TODO: Clear sort is not working when serverSideSort = false 
					t.gridView.collection.sort();
				}
			}
		}
	});
})
